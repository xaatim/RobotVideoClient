import { Socket } from "socket.io";
import { robotType } from "../drizzle/schemas";

export interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export interface Robot {
  ownerId: string;
}

export interface FrameData {
  robotId: string;
  frame: Uint8Array;
}

export interface ServerToClientEvents {
  stream: (frame: Uint8Array) => void;
  error: (msg: string) => void;
  streamStopped: (msg: { robotId: string }) => void;
}

export interface ClientToServerEvents {
  frame: (data: FrameData) => void;
  requestStream: (data: { robotId: string }) => void;
}

export interface AuthenticatedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId?: string;
  robotId?: string;
  robotKey?: string;
  robot?: robotType;
}