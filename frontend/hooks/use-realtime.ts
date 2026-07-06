import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface RealtimeMessage {
  channel: string;
  data: any;
  ts: number;
}

export function useRealtime(
  orgId: string = 're-evolve',
  onEvent?: (event: string, msg: RealtimeMessage) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to /realtime namespace
    const socket = io(`${BACKEND_URL}/realtime`, {
      auth: { orgId },
      query: { orgId },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to HGI Realtime Telemetry Grid');
    });

    // Listen to standard event routing
    socket.onAny((event: string, msg: RealtimeMessage) => {
      if (onEvent) {
        onEvent(event, msg);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from HGI Realtime Telemetry Grid');
    });

    return () => {
      socket.disconnect();
    };
  }, [orgId, onEvent]);

  const send = (event: string, payload: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, payload);
    }
  };

  return { send, socket: socketRef.current };
}
