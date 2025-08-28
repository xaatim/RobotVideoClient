import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-foreground">Ros2</div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>
            {!session ? (
              <Link href="/login">
                <Button className="cursor-pointer">Login</Button>
              </Link>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await auth.api.signOut({ headers: await headers() });
                }}>
                <Button className="cursor-pointer" type="submit">
                  Signout
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-foreground text-balance">
            Welcome to Your Dashboard
          </h1>
          {session?.user.name}
          <p className="text-lg text-muted-foreground text-pretty">
            Click the login button above to access your dashboard and get
            started.
          </p>

          <div className="pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3 cursor-pointer">
                {session ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
