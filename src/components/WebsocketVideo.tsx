"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../types/nexttoexpress";
import { Connecting } from "./DashboardComps";

const ROBOT_ID = "robot001";

export default function VideoWebsocket({
  userId,
  connected,
  setConnection,
}: {
  userId: string;
  connected: Connecting;
  setConnection: (m: Connecting) => void;
}) {
  const [streamUrl, setStreamUrl] = useState<string>("");

  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", { auth: { userId } });
    const socket = socketRef.current;
    setConnection("connecting");

    socket.on("connect", () => {
      setConnection("connected");
      console.log("Connected to Socket.IO server.");
      socket.emit("requestStream", { robotId: ROBOT_ID });
    });

    socket.on("stream", (frame) => {
      const blob = new Blob([new Uint8Array(frame)], { type: "image/jpeg" });
      setStreamUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);

        return URL.createObjectURL(blob);
      });
    });
    socket.on("streamStopped", ({ robotId }) => {
      setStreamUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return "";
      });
    });

    socket.on("error", (message) => {
      console.error("Stream error:", message);
      setStreamUrl("");
      setConnection("disconnected");
    });
    socket.on("disconnect", (m) => {
      setStreamUrl("");
    });
    return () => {
      socket.disconnect();
      setStreamUrl("");
      setConnection("disconnected");
    };
  }, []);

  return (
    <div>
      {streamUrl ? (
        <img src={streamUrl} alt="Robot Stream" style={{ maxWidth: "100%" }} />
      ) : (
        <p>Connecting to stream...</p>
      )}
    </div>
  );
}
