export interface ChatSession {
  id: number;
  session_key: string;
  customer_id?: number;
  guest_name?: string;
}

export interface ChatMessage {
  id: number;
  chat_session_id: number;
  sender_id?: number;
  sender_type: 'CUS' | 'EMP';
  message: string;
  created_at: string;
}

// Session management for browser sessionStorage
export function saveChatSession(session: ChatSession): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('chat_session_key', session.session_key);
    sessionStorage.setItem('chat_session_id', session.id.toString());
    if (session.guest_name) {
      sessionStorage.setItem('chat_guest_name', session.guest_name);
    }
  }
}

export function getChatSession(): {
  sessionKey: string;
  sessionId: number;
  guestName?: string;
} | null {
  if (typeof window === 'undefined') return null;

  const sessionKey = sessionStorage.getItem('chat_session_key');
  const sessionId = sessionStorage.getItem('chat_session_id');
  const guestName = sessionStorage.getItem('chat_guest_name');

  if (!sessionKey || !sessionId) return null;

  return {
    sessionKey,
    sessionId: parseInt(sessionId, 10),
    guestName: guestName || undefined,
  };
}

export function clearChatSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('chat_session_key');
    sessionStorage.removeItem('chat_session_id');
    sessionStorage.removeItem('chat_guest_name');
  }
}

export function hasChatSession(): boolean {
  if (typeof window === 'undefined') return false;

  const sessionKey = sessionStorage.getItem('chat_session_key');
  const sessionId = sessionStorage.getItem('chat_session_id');

  return !!(sessionKey && sessionId);
}
