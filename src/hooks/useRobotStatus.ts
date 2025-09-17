import { useEffect, useState } from "react";
import { useSocketIo } from "./useSocketIo";
import { robotMode, TwistMessage } from "../../types/types";

export function useRobotStatus(robotId?: string) {
  const { on, emit, off } = useSocketIo();
  const [status, setStatus] = useState<robotMode | null>(null);
  const [twitsData, setTwistData] = useState<TwistMessage | undefined>();
  const [isManual, setIsManual] = useState(status == "manual");

  useEffect(() => {
    const handleStatusUpdate = (mode: robotMode) => {
      setStatus(mode);
    };

    on("robot:statusUpdate", handleStatusUpdate);

    return () => {
      off("robot:statusUpdate", handleStatusUpdate);
    };
  }, []);

  useEffect(() => {
    emit("robot:controlMode", {
      serialNo: robotId!,
      RobotControlData: {
        mode: isManual ? "manual" : "autonomous",
        twist: twitsData,
      },
    });
  }, [twitsData, isManual, robotId]);

  const toggleRobotControl = (checked: boolean) => {
    setIsManual(checked);
    emit("robot:controlMode", {
      serialNo: robotId!,
      RobotControlData: {
        mode: checked ? "manual" : "autonomous",
        twist: undefined,
      },
    });
  };

  const setRobotTwist = (twist: TwistMessage) => {
    setTwistData(twist);
  };

  return { status, toggleRobotControl, setRobotTwist };
}
