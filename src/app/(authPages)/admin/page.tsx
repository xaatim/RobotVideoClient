import AdminDashboard from "@/components/AdminComps";
import {  Queries } from "../../../../drizzle/queries";
import { getAllRobots } from "@/lib/serverq";

export default async function Page() {
  const allRobots = await getAllRobots()
  return (
    <AdminDashboard intiRobots={allRobots}/>
  )
}