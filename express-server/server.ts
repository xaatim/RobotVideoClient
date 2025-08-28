// server.ts
import "dotenv/config";
import express from "express";
import http from "http";
import { DisconnectReason, Server } from "socket.io";
import db from "../drizzle/db";
import {
  AuthenticatedSocket,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/nexttoexpress";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: "*" }, //process.env.BETTER_AUTH_URL ??
});

const robotFrames = new Map<string, Uint8Array>();

io.use(async (socket: AuthenticatedSocket, next) => {
  const { userId, robotId, robotKey } = socket.handshake.auth;
  if (userId) {
    socket.userId = userId;
    const robot = await db.query.robotsTable.findFirst({
      where: (tb, fn) => fn.eq(tb.ownerId, userId),
    });
    socket.robot = robot;
  }

  if (robotId && robotKey) {
    try {
      const robot = await db.query.robotsTable.findFirst({
        where: (tb, fn) => fn.eq(tb.id, robotId),
      });
      if (!robot || robot.key !== robotKey)
        return next(new Error("Unauthorized robot"));
      socket.robot = robot;

      if (!socket.userId && robot.ownerId) {
        socket.userId = robot.ownerId;
      }
    } catch (error) {}
  }

  next();
});

io.on("connection", (socket: AuthenticatedSocket) => {
  socket.on("frame", async (data) => {
    const { robotId, frame } = data;
    const robot = socket.robot;
    if (!robot) return;

    robotFrames.set(robotId, frame);
    socket.broadcast.to(robotId).emit("stream", frame);
  });

  socket.on("requestStream", async ({ robotId }) => {
    const robot = socket.robot;
    if (!robot) return;
    if (socket.userId !== robot.ownerId) return;
    socket.join(robotId);
    const lastFrame = robotFrames.get(robotId);
    if (lastFrame) socket.emit("stream", lastFrame);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected. `);
    if (socket.robot) {
      const robotId = socket.robot.id;
      robotFrames.delete(socket.robot?.id);
      io.to(robotId).emit("streamStopped", { robotId });
    }
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on http://localhost:4000");
});
