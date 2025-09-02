import { useEffect, useState } from "react";
import { useSocketIo } from "./useSocketIo";
import { robotMode } from "../../types/nexttoexpress";

export function useRobotStatus(robotId?: string) {
  const { on, emit, off } = useSocketIo();
  const [status, setStatus] = useState<robotMode | null>(null);
  
  useEffect(() => {
    if (!robotId) return;

    emit("robot:join", { serialNo: robotId });

    const handleStatusUpdate = (mode: robotMode) => {
      setStatus(mode);
    };

    on("robot:statusUpdate", handleStatusUpdate);

    return () => {
      off("robot:statusUpdate", handleStatusUpdate);
    };
  }, [robotId]);

  const toggleMode = (isManual: boolean) => {
    emit("robot:controlMode", {
      mode: isManual ? "manual" : "autonomous",
      serialNo: robotId!,
    });
  };

  return { status, toggleMode };
}
