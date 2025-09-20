declare module 'socket.io-client' {
  export interface Socket {
    id: string;
    connected: boolean;
    disconnected: boolean;

    connect(): Socket;
    disconnect(): Socket;
    emit(event: string, ...args: any[]): Socket;
    on(event: string, listener: (...args: any[]) => void): Socket;
    off(event: string, listener?: (...args: any[]) => void): Socket;
    once(event: string, listener: (...args: any[]) => void): Socket;
  }

  export interface SocketOptions {
    transports?: string[];
    autoConnect?: boolean;
    [key: string]: any;
  }

  export function io(uri: string, options?: SocketOptions): Socket;
}
