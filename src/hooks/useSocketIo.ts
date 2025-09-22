"use client";
import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/types";

export function useSocketIo() {
  const session = authClient.useSession().data;
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(process.env.EXPRESS_URL!, {
        auth: { userId: session.user.id },
      });
      console.log("Creating new socket connection.");
    }

    const socket = socketRef.current;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      console.log("Cleaning up socket connection.");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session]);

  function on<EventKey extends keyof ServerToClientEvents>(
    event: EventKey,
    callback: ServerToClientEvents[EventKey]
  ) {
    socketRef.current?.on(event, callback as any);
    return () => socketRef.current?.off(event, callback as any);
  }
  function off<EventKey extends keyof ServerToClientEvents>(
    event: EventKey,
    callback: ServerToClientEvents[EventKey]
  ) {
    socketRef.current?.off(event, callback as any);
    return () => socketRef.current?.off(event, callback as any);
  }

  const emit = useCallback(
    <EventKey extends keyof ClientToServerEvents>(
      event: EventKey,
      ...args: Parameters<ClientToServerEvents[EventKey]>
    ) => {
      socketRef.current?.emit(event, ...args);
    },
    []
  );

  return { socket: socketRef.current, on, emit, isConnected, off };
}
