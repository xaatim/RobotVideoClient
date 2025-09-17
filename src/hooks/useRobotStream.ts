import { userRobots } from "@/lib/serverq";
import { useEffect, useState } from "react";
import { videoMode } from "../../types/types";
import { useSocketIo } from "./useSocketIo";
type stream = {
  selectedRobot: userRobots | null;
  videoMode: videoMode;
};
export function useRobotStream({ selectedRobot, videoMode }: stream) {
  const [streamUrl, setStreamUrl] = useState("");
  const { emit, on, off, socket, isConnected } = useSocketIo();
  useEffect(() => {
    if (!selectedRobot || !isConnected) return;
    console.log("this hapened");

    emit("robot:videoMode", {
      vidoeMode: videoMode,
      serialNo: selectedRobot.serialNo,
    });//send mode 

    emit("robot:requestStream", { serialNo: selectedRobot.serialNo });

    console.log("righ before requesting frames");
    const handleStream = (frame: Uint8Array<ArrayBufferLike>) => {
      const blob = new Blob([new Uint8Array(frame)], { type: "image/jpeg" });
      setStreamUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    };

    const handleStop = () => {
      setStreamUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return "";
      });
    };

    on("robot:stream", handleStream);
    on("robot:streamStop", handleStop);

    return () => {
      off("robot:stream", handleStream);
      off("robot:streamStop", handleStop);
      setStreamUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return "";
      });
    };
  }, [selectedRobot, socket, videoMode, isConnected]);

  return streamUrl;
}
