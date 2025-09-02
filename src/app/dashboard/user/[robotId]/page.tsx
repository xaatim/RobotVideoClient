import RobotControRoom from "@/components/RobotRoom";
import { Auth, getServerReturnUrl, getUserRobot } from "@/lib/serverq";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ robotId: number }>;
}) {
  const { robotId } = await params;
  const refree = await getServerReturnUrl();
  if (typeof Number(robotId) !== "number") redirect(refree);
  const session = await Auth();
  if (!session) return;
  const robot = await getUserRobot(session.user.id, robotId);
  if (!robot) redirect(refree);
  return <RobotControRoom intialRobot={robot} />;
}
