import AdminDashboard from "@/components/AdminComps";
import { getAllRobotModels, getAllRobots, IsAuthorized } from "@/lib/serverq";

export default async function Page() {
  const allRobots = await getAllRobots();
  const allModels = await getAllRobotModels();
  await IsAuthorized(["ADMIN"]);
  return <AdminDashboard intiRobots={allRobots} Models={allModels} />;
}
