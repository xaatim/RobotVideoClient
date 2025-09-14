"use server";

import { eq, and, sql } from "drizzle-orm";
import db from "../../drizzle/db";
import {
  robotModelTable,
  robotSerialNoSeq,
  robotsTable,
  userRoleType,
} from "../../drizzle/schemas";
import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { robotOwnershipSchema, robotOwnershipSchemaData } from "./zodTypes";

export type robot = Awaited<ReturnType<typeof getAllRobots>>[number];
export type userRobots = Awaited<ReturnType<typeof getUserRobots>>[number];

export async function getAllRobots() {
  return await db.query.robotsTable.findMany({
    with: { owner: true, modelRelation: true },
  });
}
export async function getUserRobots(userId: string) {
  return await db.query.robotsTable.findMany({
    where: (tb, fn) => fn.eq(tb.ownerId, userId),
    with: { modelRelation: true },
  });
}
export async function getUserRobot(userId: string, robotId: number) {
  try {
    const result = await db.query.robotsTable.findFirst({
      where: (tb, fn) =>
        fn.and(fn.eq(tb.ownerId, userId), fn.eq(tb.id, robotId)),
      with: { modelRelation: true },
    });
    return result
  } catch (error) {
    console.log(error)
  }
}
type updateRobotProp = {
  values: robotOwnershipSchemaData;
  userId: string;
};
export async function updateRobotOwnerShip(formData: updateRobotProp) {
  const { userId } = formData;

  try {
    const data = robotOwnershipSchema.safeParse(formData.values);
    if (!data.success) {
      throw new Error("all fields are required");
    }
    const { customName, key: robotKey, serialNo } = data.data;
    const old = await db.query.robotsTable.findFirst({
      where: (tb, fn) => fn.eq(tb.serialNo, serialNo),
    });

    if (!old) {
      throw new Error("no Such Robot Exist");
    }
    if (old.ownerId === userId || old.ownerId) {
      console.log("this happend");
      throw new Error("this Robot is Already Owned");
    }
    const result = await db
      .update(robotsTable)
      .set({
        ownerId: userId,
        customName,
      })
      .where(
        and(eq(robotsTable.serialNo, serialNo), eq(robotsTable.key, robotKey))
      )
      .returning();
    if (!result) {
      throw new Error("no such robot registred");
    }
  } catch (error) {
    throw new Error(`unable to register: ${(error as Error).message}`);
  }
}
export async function createRobot(values: { robotKey: string; model: string }) {
  const { robotKey, model } = values;
  const regex = /^[^-]+-[^-]+-[^-]+$/;

  if (!regex.test(model)) {
    throw new Error("model must follow company-type-model");
  }
  const serialPrifx = model.split("-")[0] + model.split("-")[2] + "-SN-"; //todo "BR-SUV-100" => BR100-SN-

  if (!robotKey || !model) {
    throw new Error("all Fields are required");
  }
  const oldKey = await db.query.robotsTable.findFirst({
    where: (tb, fn) => fn.eq(tb.key, robotKey),
    columns: { key: true },
  });
  if (oldKey) {
    throw new Error("this key already exist");
  }
  try {
    const selecetdModel = await db.query.robotModelTable.findFirst({
      where: (tb, fn) => fn.eq(tb.model, model),
    });
    if (!selecetdModel) {
      throw new Error("No such model Exist");
    }

    const result = await db
      .insert(robotsTable)
      .values({
        modelId: selecetdModel.id,
        serialNo: sql`${serialPrifx} || LPAD(nextval('${sql.raw(
          robotSerialNoSeq.seqName!
        )}')::text, 4, '0')`,

        key: robotKey,
      })
      .returning();
    return { result: result[0], success: true };
  } catch (error) {
    console.log(error);
    throw new Error("serial number have to be unique try again");
  }
}
export type allModels = Awaited<ReturnType<typeof getAllRobotModels>>;
export async function getAllRobotModels() {
  return await db.query.robotModelTable.findMany();
}
export async function addNewModel(values: {
  model: string;
  modelType: string;
}) {
  const { model, modelType } = values;
  if (!model) {
    throw new Error("all fields are required");
  }
  try {
    const exsist = await db.query.robotModelTable.findFirst({
      where: (tb, fn) => fn.eq(tb.model, model),
    });
    if (exsist) {
      throw new Error("this Model already exist");
    }
    const result = await db
      .insert(robotModelTable)
      .values({
        model,
        modelType,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error("unable to add new model");
  }
}

export async function Auth() {
  const serverHeaders = await headers();
  const session = await auth.api.getSession({ headers: serverHeaders });
  return session;
}
export async function IsAuthorized(whichRole: userRoleType[]) {
  const session = await Auth();
  const refress = `/dashboard/${session?.user.role?.toLocaleLowerCase()}`;
  if (!session) redirect("/");

  if (!whichRole.includes(session.user.role as userRoleType)) redirect(refress);
  return { user: session.user };
}
export async function deleteRobot(serialNo: string) {
  if (!serialNo) throw new Error("serial no is required to delete this robot");
  try {
    await db.delete(robotsTable).where(eq(robotsTable.serialNo, serialNo));
  } catch (error) {
    console.log(error);
    throw new Error("unable to delete robot record");
  }
}

export async function getServerReturnUrl() {
  const headersList = await headers();
  const referer =
    headersList.get("referer") ?? `${process.env.BETTER_AUTH_URL}/dashboard/`;
  return referer;
}

export async function getRobotsCountByModel() {
  const result = await db.select({
    model: robotModelTable.model,
    count: sql<number>`count(${robotsTable.id})`,
  })
  .from(robotModelTable)
  .leftJoin(robotsTable, eq(robotModelTable.id, robotsTable.modelId))
  .groupBy(robotModelTable.model);

  return result;
}

export async function getAllUsers() {
  return await db.query.user.findMany();
}
