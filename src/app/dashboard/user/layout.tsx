import { IsAuthorized } from "@/lib/serverq";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  await IsAuthorized(["USER"]);

  return (
    <main className="h-full w-full flex flex-col justify-center items-center ">
      {children}
    </main>
  );
}
