import { Auth } from "@/lib/serverq";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await Auth();
  if (!session) redirect("/login");

  redirect(`/dashboard/${session.user.role?.toLocaleLowerCase()}`);
}
