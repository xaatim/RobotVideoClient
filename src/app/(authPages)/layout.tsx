import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const serverHeaders = await headers();
  const session = await auth.api.getSession({ headers: serverHeaders });
  const refress =  "/";
  if (!session) redirect(refress);

  return (
    <main className="h-full w-full flex flex-col justify-center items-center ">
      {children}
    </main>
  );
}
