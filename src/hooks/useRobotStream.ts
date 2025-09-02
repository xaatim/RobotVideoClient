import { userRobots } from "@/lib/serverq";
import { useEffect, useState } from "react";
import { useSocketIo } from "./useSocketIo";

export function useRobotStream(selectedRobot: userRobots | null) {
  const [streamUrl, setStreamUrl] = useState("");
  const {emit,on,off,socket} = useSocketIo()
  useEffect(() => {
    if (!selectedRobot) return;

    emit("robot:requestStream", { serialNo: selectedRobot.serialNo });

    const handleStream = (frame: Uint8Array<ArrayBufferLike>) => {
      const blob = new Blob([new Uint8Array(frame)], { type: "image/jpeg" });
      setStreamUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    };

    const handleStop = () => {
      setStreamUrl(oldUrl => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return "";
      });
    };

    on("robot:stream", handleStream);
    on("robot:streamStop", handleStop);

    return () => {
      off("robot:stream", handleStream);
      off("robot:streamStop", handleStop);
      setStreamUrl(oldUrl => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return "";
      });
    };
  }, [selectedRobot, socket]);

  return streamUrl;
}
