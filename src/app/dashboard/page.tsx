import DashboardComps from "@/components/DashboardComps";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  return <DashboardComps userId={session?.user.id!} />;
}
