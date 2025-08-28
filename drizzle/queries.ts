"use server";

import db from "./db";
import { robotsTable } from "./schemas";

export const Queries = {
  getRobotByUserId: async function (robotId: string) {},
  createRobot: async function (robotId: string, robotKey: string) {
    await db.insert(robotsTable).values({
      id: robotId,
      key: robotKey,
    });
  },
  getAllRobots: async function () {
    return await db.query.robotsTable.findMany();
  },
};
export type dbTypes = {
  Robots: Awaited<ReturnType<typeof Queries.getAllRobots>>;
};
