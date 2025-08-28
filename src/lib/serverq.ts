"use server";

import { eq, and } from "drizzle-orm";
import db from "../../drizzle/db";
import { robotsTable } from "../../drizzle/schemas";

export async function getAllRobots() {
  return await db.query.robotsTable.findMany();
}
export async function updateRobotOwnerShip(
  robotId: string,
  robotKey: string,
  userId: string
) {
  try {
    const result = await db
      .update(robotsTable)
      .set({
        ownerId: userId,
      })
      .where(and(eq(robotsTable.id, robotId), eq(robotsTable.key, robotKey)))
      .returning();
    if (!result) {
      throw new Error("no such robot registred");
    }
  } catch (error) {
    throw new Error("unable to register");
  }
}
export async function createRobot(robotId: string, robotKey: string) {
  try {
    const result = await db.insert(robotsTable).values({
    id: robotId,
    key: robotKey,
  }).returning();
  return {result:result[0],success:true}
  } catch (error) {
    throw new Error("names have to be unique try again")
  }
}
