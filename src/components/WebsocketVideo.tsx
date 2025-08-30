"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  Connecting,
  ServerToClientEvents,
} from "../../types/nexttoexpress";
import { useSocket } from "./useWebsocket";

export default function VideoWebsocket({
  setConnection,
  serialNo,
}: {
  userId: string;
  serialNo: string;
  connected: Connecting;
  setConnection: (m: Connecting) => void;
}) {
  const [streamUrl, setStreamUrl] = useState<string>("");

  const { on, emit, isConnected, socket } = useSocket();
  useEffect(() => {
    if (isConnected) {
      emit("robot:requestStream", { serialNo: serialNo });
      on("robot:stream", (frame) => {
        const blob = new Blob([new Uint8Array(frame)], { type: "image/jpeg" });
        setStreamUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);

          return URL.createObjectURL(blob);
        });
      });
      on("robot:streamStop", ({ serialNo }) => {
        setStreamUrl((oldUrl) => {
          if (oldUrl) URL.revokeObjectURL(oldUrl);
          return "";
        });
      });
    }
    socket?.on("disconnect", () => {
      setStreamUrl("");
    });
    on("error", (message) => {
      console.error("Stream error:", message);
      setStreamUrl("");
      setConnection("disconnected");
    });

    return () => {
      socket?.disconnect();
      setStreamUrl("");
      setConnection("disconnected");
    };
  }, [serialNo]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {streamUrl ? (
        <img
          src={streamUrl}
          alt="Robot Stream"
          className="aspect-square w-full h-full"
        />
      ) : (
        <p>Connecting to stream...</p>
      )}
    </div>
  );
}
