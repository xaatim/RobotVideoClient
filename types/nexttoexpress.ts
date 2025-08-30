import { Socket } from "socket.io";
import { robotType } from "../drizzle/schemas";

export interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export interface Robot {
  ownerId: string;
}


interface ServerToRobotEvent {
  "robot:controlMode": (mode: "autonomous" | "manual") => void;
}
interface RobotToServerEvent {
  "robot:status": (mode: "autonomous" | "manual") => void;
  "robot:frame": (frame: Uint8Array) => void;
}

export interface ServerToClientEvents extends ServerToRobotEvent {
  "robot:stream": (frame: Uint8Array) => void;
  "robot:streamStop": (msg: { serialNo: string }) => void;
  "robot:statusUpdate": (mode: "autonomous" | "manual") => void;
  error: (msg: string) => void;
}
export interface ClientToServerEvents extends RobotToServerEvent {
  "robot:join": (data: { serialNo: string }) => void;
  "robot:requestStream": (data: { serialNo: string }) => void;
  "robot:controlMode": (msg: {
    mode: "autonomous" | "manual";
    serialNo: string;
  }) => void;
}

export interface AuthenticatedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId?: string;
  robot?: robotType;
}
export type Connecting = "connected" | "disconnected" | "connecting";
