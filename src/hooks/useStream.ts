"use client";

import { useSocket } from "@/components/useWebsocket";
import { useEffect, useState } from "react";

export default function useStream(serialNo: string) {
  const { on, emit } = useSocket();
  const [streamUrl, setStreamUrl] = useState<string>("");

  useEffect(() => {
    if (serialNo) {
      emit("robot:requestStream", { serialNo });
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
      return () => {
        setStreamUrl((oldUrl) => {
          if (oldUrl) URL.revokeObjectURL(oldUrl);
          return "";
        });
      };
    }
  }, [serialNo]);
  return {streamUrl:streamUrl}
}
