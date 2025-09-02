import RobotComps from "@/components/RobotComps";
// import UserDashboardComps from "@/components/UserDashboardComps";
import { Auth, getAllRobotModels, getUserRobots } from "@/lib/serverq";
import React from "react";

export default async function Page() {
  const session = await Auth();
  if (!session) return;
  const allUserRobot = await getUserRobots(session?.user.id);

  return <RobotComps robots={allUserRobot} user={session.user!} />;
}
