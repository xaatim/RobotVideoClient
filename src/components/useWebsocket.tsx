// Corrected useSocket hook
"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/nexttoexpress";

export function useSocket() {
  const session = authClient.useSession().data;
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only proceed if a user session is available
    if (!session?.user?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect if there is no existing socket instance
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        auth: { userId: session.user.id },
      });
      console.log("Creating new socket connection.");
    }

    const socket = socketRef.current;
    
    // Add event listeners
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // This is the cleanup function that will run when the component unmounts
    // or when the dependencies change. It's crucial for resource management.
    return () => {
      console.log("Cleaning up socket connection.");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    
  }, [session]); // Dependency on session ensures a new socket is created if the user logs in or out.

  function on<EventKey extends keyof ServerToClientEvents>(
    event: EventKey,
    callback: ServerToClientEvents[EventKey]
  ) {
    socketRef.current?.on(event, callback as any);
    // Returning the off function is good practice for managing event listeners
    return () => socketRef.current?.off(event, callback as any);
  }

  function emit<EventKey extends keyof ClientToServerEvents>(
    event: EventKey,
    ...args: Parameters<ClientToServerEvents[EventKey]>
  ) {
    socketRef.current?.emit(event, ...args);
  }

  return { socket: socketRef.current, on, emit, isConnected };
}