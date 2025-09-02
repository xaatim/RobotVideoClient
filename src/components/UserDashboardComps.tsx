"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Battery,
  MapPin,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Users,
  BarChart3,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { userRobots } from "@/lib/serverq";
import { useSocket } from "./useWebsocket";
import { Connecting } from "../../types/nexttoexpress";
import { RobotSelector } from "./RobotSelector";


export default function UserDashboardComps({
  allRobots,
}: {
  allRobots: userRobots[];
}) {
  const [selectedRobot, setSelectedRobot] = useState<userRobots | null>(null);
  const session = authClient.useSession().data;
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState<Connecting>("connecting");
  const { on, emit } = useSocket();
  const [streamUrl, setStreamUrl] = useState<string>("");

  const [robotStatus, setRobotStatus] = useState<
    "autonomous" | "manual" | null
  >(null);
  const [isUserToggling, setIsUserToggling] = useState(true);
  useEffect(() => {
    if (selectedRobot) {
      emit("robot:join", { serialNo: selectedRobot?.serialNo });
    }
  }, [selectedRobot]);

  useEffect(() => {
    if (selectedRobot) {
      const handleStatusUpdate = (mode: "autonomous" | "manual") => {
        console.log("From client:", mode);
        setRobotStatus(mode);
        setIsUserToggling(false);
      };
      on("robot:statusUpdate", handleStatusUpdate);
      return () => {};
    }
  }, [on, selectedRobot]);

  useEffect(() => {
    if (selectedRobot) {
      emit("robot:requestStream", { serialNo: selectedRobot?.serialNo });
      on("robot:stream", (frame) => {
        const blob = new Blob([new Uint8Array(frame)], { type: "image/jpeg" });
        setStreamUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);

          return URL.createObjectURL(blob);
        });
      });
      on("robot:streamStop", ({ serialNo }) => {
        setStreamUrl((oldUrl) => {
          if (oldUrl) URL.revokeObjectURL(oldUrl);
          return "";
        });
      });
      return () => {
        setStreamUrl((oldUrl) => {
          if (oldUrl) URL.revokeObjectURL(oldUrl);
          return "";
        });
      };
    }
  }, [selectedRobot]);
  function handleTogeling(checked: boolean) {
    setIsUserToggling(checked);
    emit("robot:controlMode", {
      mode: checked ? "manual" : "autonomous",
      serialNo: selectedRobot?.serialNo!,
    });
  }

  return (
    <div className="w-full h-full bg-gradient-to-br">
      <nav className="border-b  backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="text-2xl font-bold font-orbitron tracking-wider "
              >
                BE🤖M <span className="text-emerald-400">ROBOTICS</span>
              </Link>
              <Badge
                variant="secondary"
                className="ml-2 bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
              >
                Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300 text-sm">
                Welcome, {session?.user?.email}
              </span>
              <Button variant="outline" size="sm" className=" bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Total Robots
              </CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Active Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-slate-400" />
            </CardHeader>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Avg Battery
              </CardTitle>
              <Battery className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{"100"}%</div>
              <p className="text-xs text-slate-400">Fleet average</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle className="text-slate-200">Uptime</CardTitle>
              <CardDescription className="text-slate-400">
                Last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">98.5%</div>
              <p className="text-xs text-slate-400">System reliability</p>
            </CardContent>
          </Card>
        </div>
        {/* <RobotOwnershipDialog open={open} setOpen={setOpen} /> */}

        {allRobots.length === 0 ? (
          <Card className="">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Activity className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Robots Registered
              </h3>
              <p className="text-slate-400 text-center mb-6 max-w-md">
                Get started by registering your first monitoring-enabled robot.
                You'll need the serial number and product key that came with
                your device.
              </p>
              <Button onClick={() => setOpen((prev) => !prev)}>
                <Plus className="w-4 h-4 mr-2" />
                Register Your First Robot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RobotSelector
              allRobots={allRobots}
              handleTogeling={handleTogeling}
              isUserToggling={isUserToggling}
              selectedRobot={selectedRobot!}
              setSelectedRobot={setSelectedRobot}
            />
            <div className="lg:col-span-2">
              {selectedRobot && (
                <Card className="">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-200">
                          {selectedRobot.customName}
                        </CardTitle>
                        <CardDescription className="text-slate-400 flex flex-col gap-2 ">
                          <p>Live camera feed and controls</p>
                          <p className="text-muted-foreground text-xs">
                            current robot stats:
                          </p>
                          {robotStatus && <Badge>{robotStatus}</Badge>}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Record
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center mb-6 border">
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        {streamUrl ? (
                          <img
                            src={streamUrl}
                            alt="Robot Stream"
                            className="aspect-square w-full h-full"
                          />
                        ) : (
                          <p>Connecting to stream...</p>
                        )}
                      </div>
                    </div>

                    {/* Robot Details */}
                    <Tabs defaultValue="status" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                        <TabsTrigger
                          value="status"
                          className="data-[state=active]:bg-slate-600 text-slate-300"
                        >
                          Status
                        </TabsTrigger>
                        <TabsTrigger
                          value="controls"
                          className="data-[state=active]:bg-slate-600 text-slate-300"
                        >
                          Controls
                        </TabsTrigger>
                        <TabsTrigger
                          value="analytics"
                          className="data-[state=active]:bg-slate-600 text-slate-300"
                        >
                          Analytics
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="status" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-200">
                              Battery Level
                            </label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Progress value={50} className="flex-1" />
                              <span className="text-sm text-slate-400">
                                55%
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-200">
                              Last Seen
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-200">
                            Current Location
                          </label>
                          <p className="text-sm text-slate-400 mt-1">unknown</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-200">
                            Robot Type
                          </label>
                          <p className="text-sm text-slate-400 mt-1 capitalize">
                            {selectedRobot.modelRelation.modelType}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="controls" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Patrol
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Set Waypoint
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Share Access
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="analytics" className="space-y-4">
                        <div className="text-center text-slate-400">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                          <p>Analytics dashboard coming soon</p>
                          <p className="text-sm">
                            Track performance, incidents, and usage patterns
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

