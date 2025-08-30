import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {

  return (
    <main className="h-full w-full flex flex-col justify-center items-center ">
      {children}
    </main>
  );
}
