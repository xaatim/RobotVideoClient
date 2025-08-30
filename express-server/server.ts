// server.ts
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import db from "../drizzle/db";
import {
  AuthenticatedSocket,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/nexttoexpress";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: "*" },
});

io.use(async (socket: AuthenticatedSocket, next) => {
  const { userId, serialNo, robotKey } = socket.handshake.auth;

  if (userId) {
    const user = await db.query.user.findFirst({
      where: (tb, fn) => fn.eq(tb.id, userId),
    });
    if (!user) return next(new Error("Unauthorized user"));
    socket.userId = userId;
    return next();
  }

  if (serialNo && robotKey) {
    const robot = await db.query.robotsTable.findFirst({
      where: (tb, fn) =>
        fn.and(fn.eq(tb.serialNo, serialNo), fn.eq(tb.key, robotKey)),
    });
    if (!robot) return next(new Error("Unauthorized robot"));

    socket.robot = robot;
    if (robot.ownerId) {
      socket.userId = robot.ownerId;
    }

    socket.join(serialNo);

    return next();
  }

  next(new Error("Unauthorized client"));
});

const robotFrames = new Map<string, Uint8Array>();
const userSockets = new Map<string, Set<string>>();

io.on("connection", (socket: AuthenticatedSocket) => {
  console.log(`Socket connected: ${socket.id}`);

  if (socket.userId) {
    const sockets = userSockets.get(socket.userId) || new Set<string>();
    sockets.add(socket.id);
    userSockets.set(socket.userId, sockets);
    console.log(
      `User ${socket.userId} connected. Total connections: ${sockets.size}`
    );
  }

  if (socket.robot) {
    console.log(
      `Robot ${socket.robot.serialNo} connected by user ${socket.userId}`
    );
  }

  console.log("user map", JSON.stringify([...userSockets.entries()]));

  socket.on("robot:join", ({ serialNo }) => {
    if (socket.userId) {
      console.log(
        `User ${socket.userId} is attempting to join robot room: ${serialNo}`
      );
      socket.rooms.forEach((room) => {
        if (room !== socket.id) socket.leave(room);
      });
      socket.join(serialNo);
    } else {
      console.log("Socket is not a user, cannot join a robot room.");
    }
  });

  socket.on("robot:frame", (frame) => {
    if (socket.robot) {
      // console.log("robot sending frames: ",socket.robot?.serialNo)
      // console.log("camera recieaved \n",frame)
      robotFrames.set(socket.robot.serialNo, frame);
      socket.broadcast.to(socket.robot.serialNo).emit("robot:stream", frame);
    }
  });

  socket.on("robot:requestStream", ({ serialNo }) => {
    console.log(" requested stream for robot ",serialNo);
    if (socket.userId) {
      console.log("client requested stream");
      const lastFrame = robotFrames.get(serialNo);
      if (lastFrame) {
        console.log("emmting last frame to :", serialNo);
        socket.join(serialNo);
        socket.emit("robot:stream", lastFrame);
      }
    }
  });

  socket.on("robot:status", (mode) => {
    if (socket.robot) {
      console.log("got status from robot", mode);
      socket.broadcast
        .to(socket.robot.serialNo)
        .emit("robot:statusUpdate", mode);
    }
  });

  socket.on("robot:controlMode", ({ mode, serialNo }) => {
    if (socket.userId) {
      console.log(
        `User ${socket.userId} sending mode ${mode} to robot ${serialNo}`
      );
      socket.to(serialNo).emit("robot:controlMode", mode);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId && userSockets.has(socket.userId)) {
      const sockets = userSockets.get(socket.userId)!;
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSockets.delete(socket.userId);
        console.log(
          `All connections for user ${socket.userId} have disconnected.`
        );
      }
    }

    if (socket.robot) {
      const serialNo = socket.robot.serialNo;
      console.log(`Robot ${serialNo} disconnected.`);
      robotFrames.delete(serialNo);
      io.to(serialNo).emit("robot:streamStop", { serialNo });
    }
  });
});
server.listen(4000, () => {
  console.log("Socket.IO server running on http://localhost:4000");
});
