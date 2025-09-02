import { Socket } from "socket.io";
import { robotType } from "../drizzle/schemas";

export interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export interface Robot {
  ownerId: string;
}

export type robotMode = "autonomous" | "manual";
export type RobotControl = {
  mode:robotMode,
  twist?:TwistMessage
}
interface ServerToRobotEvent {
  "robot:controlMode": (RobotControlData:RobotControl) => void;
}
interface RobotToServerEvent {
  "robot:status": (mode: robotMode) => void;
  "robot:frame": (frame: Uint8Array) => void;
}

export interface ServerToClientEvents extends ServerToRobotEvent {
  "robot:stream": (frame: Uint8Array) => void;
  "robot:streamStop": (msg: { serialNo: string }) => void;
  "robot:statusUpdate": (mode: robotMode) => void;
  error: (msg: string) => void;
}
export interface ClientToServerEvents extends RobotToServerEvent {
  "robot:join": (data: { serialNo: string }) => void;
  "robot:requestStream": (data: { serialNo: string }) => void;
  "robot:controlMode": (msg: { RobotControlData:RobotControl; serialNo: string }) => void;
}

export interface AuthenticatedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId?: string;
  robot?: robotType;
}
export type Connecting = "connected" | "disconnected" | "connecting";
export type TwistMessage = {
  x: number;
  z: number;

};
