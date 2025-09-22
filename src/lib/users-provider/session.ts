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
  }
}

export function getChatSession(): {
  sessionKey: string;
} | null {
  if (typeof window === 'undefined') return null;

  const sessionKey = sessionStorage.getItem('chat_session_key');

  if (!sessionKey) return null;

  return {
    sessionKey,
  };
}

export function clearChatSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('chat_session_key');
  }
}

export function hasChatSession(): boolean {
  if (typeof window === 'undefined') return false;

  const sessionKey = sessionStorage.getItem('chat_session_key');

  return !!sessionKey;
}
