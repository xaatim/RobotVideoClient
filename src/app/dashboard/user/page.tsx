import UserDashboardComps from "@/components/UserDashboardComps";
import { Auth, getAllRobotModels, getUserRobots } from "@/lib/serverq";
import React from "react";

export default async function Page() {
  const { user } = (await Auth())!;
  const allUserRobot = await getUserRobots(user.id);

  return <UserDashboardComps allRobots={allUserRobot}  />;
}
