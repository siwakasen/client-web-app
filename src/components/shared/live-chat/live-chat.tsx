'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  saveChatSession,
  getChatSession,
  clearChatSession,
  hasChatSession,
  ChatSession,
  ChatMessage,
} from '@/lib/users-provider/client';
import { Customer } from '@/interfaces';

type UIMessage = {
  id: string;
  author: 'me' | 'support' | 'system';
  text: string;
  timestamp: number;
};

export default function LiveChat({ customer }: { customer?: Customer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [guestName, setGuestName] = useState(customer?.name || '');
  const [pendingName, setPendingName] = useState(customer?.name || '');
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [sessionRejoinTimeout, setSessionRejoinTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const joinButtonRef = useRef<HTMLButtonElement | null>(null);

  const title = useMemo(
    () => (hasJoined ? `Customer Service` : 'Need Any Assistance?'),
    [hasJoined]
  );

  // Initialize socket connection
  const initSocket = useCallback(() => {
    if (socketRef.current) return;

    const socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'localhost:3008',
      {
        transports: ['websocket'],
        autoConnect: false,
      }
    );

    socket.on('connect', () => {
      setConnectionError(null);

      // Automatically check for existing session when connected
      if (hasChatSession() && !hasJoined) {
        const existingSession = getChatSession();
        if (existingSession) {
          setIsConnecting(true);

          socket.emit('rejoin_session', {
            sessionKey: existingSession.sessionKey,
          });
        }
      }
    });

    socket.on('disconnect', () => {});

    socket.on('connect_error', (error: Error) => {
      setConnectionError('Failed to connect to chat server');
      setIsConnecting(false);
    });

    // Handle session started
    socket.on('session_started', (session: ChatSession) => {
      saveChatSession(session);
      setSessionId(session.id);
      setGuestName(session.guest_name || '');
      setHasJoined(true);
      setIsConnecting(false);

      setMessages([
        {
          id: 'welcome',
          author: 'system',
          text: `Hi ${session.guest_name}! You are now connected. Ask us anything.`,
          timestamp: Date.now(),
        },
      ]);
    });

    // Handle session rejoined
    socket.on(
      'session_rejoined',
      (data: {
        sessionId: number;
        customerId?: number;
        guestName?: string;
      }) => {
        // Clear the rejoin timeout
        if (sessionRejoinTimeout) {
          clearTimeout(sessionRejoinTimeout);
          setSessionRejoinTimeout(null);
        }

        setSessionId(data.sessionId);
        setGuestName(data.guestName || '');
        setHasJoined(true);
        setIsConnecting(false);

        setMessages([
          {
            id: 'rejoin',
            author: 'system',
            text: `Welcome back, ${data.guestName}!`,
            timestamp: Date.now(),
          },
        ]);
      }
    );

    // Handle chat history
    socket.on('messages', (chatMessages: ChatMessage[]) => {
      const uiMessages: UIMessage[] = chatMessages.map((msg) => ({
        id: `msg-${msg.id}`,
        author: msg.sender_type === 'CUS' ? 'me' : 'support',
        text: msg.message,
        timestamp: new Date(msg.created_at).getTime(),
      }));
      setMessages((prev) => [...prev, ...uiMessages]);
    });

    // Handle new message
    socket.on('new_message', (message: ChatMessage) => {
      const uiMessage: UIMessage = {
        id: `msg-${message.id}`,
        author: message.sender_type === 'CUS' ? 'me' : 'support',
        text: message.message,
        timestamp: new Date(message.created_at).getTime(),
      };
      setMessages((prev) => [...prev, uiMessage]);
    });

    // Handle session errors
    socket.on('session_error', (error: { message: string }) => {
      // Clear the rejoin timeout
      if (sessionRejoinTimeout) {
        clearTimeout(sessionRejoinTimeout);
        setSessionRejoinTimeout(null);
      }

      setConnectionError(error.message);
      setIsConnecting(false);
      // Clear invalid session
      clearChatSession();
      setHasJoined(false);
      setSessionId(null);
    });

    // Handle session ended
    socket.on('session_ended', (data: { message: string }) => {
      clearChatSession();
      setHasJoined(false);
      setSessionId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `ended-${Date.now()}`,
          author: 'system',
          text: data.message,
          timestamp: Date.now(),
        },
      ]);
    });

    socketRef.current = socket;
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };

    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    initSocket();

    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
    }

    // Session rejoin is now handled automatically in the connect event
    // If no existing session, show the join form
    if (!hasChatSession()) {
      setTimeout(() => {
        // If customer has a name, focus the button, otherwise focus the input
        if (customer?.name) {
          joinButtonRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 50);
    }
  }, [initSocket]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleJoin = useCallback(() => {
    const trimmed = pendingName.trim();
    if (!trimmed || !socketRef.current) return;

    setIsConnecting(true);
    setConnectionError(null);

    socketRef.current.emit('start_session', {
      guestName: trimmed,
      customerId: customer?.id,
    });
  }, [pendingName, customer?.id]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || !hasJoined || !sessionId || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      chatSessionId: sessionId,
      message: text,
      senderId: customer?.id,
    });

    setInputValue('');
  }, [inputValue, hasJoined, sessionId]);

  const handleEndSession = useCallback(() => {
    if (!sessionId || !socketRef.current) return;

    socketRef.current.emit('end_session', {
      chatSessionId: sessionId,
    });
  }, [sessionId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (!hasJoined) {
          handleJoin();
        } else {
          handleSend();
        }
      }
    },
    [hasJoined, handleJoin, handleSend]
  );

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Clear any pending session rejoin timeout
      if (sessionRejoinTimeout) {
        clearTimeout(sessionRejoinTimeout);
      }
    };
  }, [sessionRejoinTimeout]);

  return (
    <div>
      {/* Floating toggle button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="lg"
          className="rounded-full h-12 px-4 shadow-lg shadow-black/20 flex items-center gap-2 cursor-pointer"
          onClick={openChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M2.25 12c0-4.97 4.643-9 10.375-9s10.375 4.03 10.375 9-4.643 9-10.375 9c-.88 0-1.732-.093-2.543-.27-.29-.063-.593.01-.82.197L5.2 22.8c-.74.617-1.879.048-1.753-.885l.318-2.353c.04-.3-.078-.6-.309-.813C2.954 17.482 2.25 14.844 2.25 12z" />
          </svg>
          <span className="text-sm font-medium">Quick Assist</span>
        </Button>
      </div>

      {/* Popup panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)]">
          <div className="bg-background border rounded-xl shadow-2xl flex flex-col h-[500px] max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    connectionError
                      ? 'bg-red-500'
                      : hasJoined
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-yellow-500'
                  }`}
                />
                <p className="font-medium text-sm truncate">{title}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {hasJoined && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEndSession}
                  >
                    <span className="text-xs">End Chat</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={closeChat}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Connection Error */}
            {connectionError && (
              <div className="p-3 bg-red-50 border-b flex-shrink-0">
                <p className="text-sm text-red-600">{connectionError}</p>
              </div>
            )}

            {/* Body */}
            {!hasJoined ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {hasChatSession()
                    ? 'Reconnecting to your session...'
                    : 'Enter your name to start chatting.'}
                </p>
                {!hasChatSession() && (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="Your name"
                      value={pendingName}
                      onChange={(e) => setPendingName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isConnecting || pendingName === customer?.name}
                    />
                    <Button
                      ref={joinButtonRef}
                      onClick={handleJoin}
                      disabled={!pendingName.trim() || isConnecting}
                      className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {isConnecting ? 'Connecting...' : 'Join'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className="flex">
                        <div
                          className={
                            m.author === 'me'
                              ? 'ml-auto max-w-[75%] rounded-2xl bg-primary text-primary-foreground px-3 py-2'
                              : m.author === 'support'
                              ? 'mr-auto max-w-[75%] rounded-2xl bg-blue-100 text-blue-900 px-3 py-2'
                              : 'mr-auto max-w-[85%] rounded-2xl bg-muted px-3 py-2'
                          }
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {m.text}
                          </p>
                          {m.author !== 'system' && (
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(m.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="p-3 flex items-center gap-2 flex-shrink-0">
                  <Input
                    ref={inputRef}
                    placeholder={`Message as ${guestName}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button onClick={handleSend} disabled={!inputValue.trim()}>
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
