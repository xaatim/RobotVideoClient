"use client";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  Shield,
  Sprout,
  GraduationCap,
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
import RobotOwnershipDialog from "./RobotOwnershipDialog";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { useSocket } from "./useWebsocket";
import VideoWebsocket from "./WebsocketVideo";
import { Connecting } from "../../types/nexttoexpress";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "surveillance":
      return <Shield className="w-4 h-4" />;
    case "agricultural":
      return <Sprout className="w-4 h-4" />;
    case "exam_monitoring":
      return <GraduationCap className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

export default function UserDashboardComps({
  allRobots,
}: {
  allRobots: userRobots[];
}) {
  const [selectedRobot, setSelectedRobot] = useState<userRobots | null>(null);
  const session = authClient.useSession().data;
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState<Connecting>("connecting");
  const { on, emit, socket } = useSocket();
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
        <RobotOwnershipDialog open={open} setOpen={setOpen} />

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
            {/* Robot Fleet */}
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-3">
                <Card className="">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-200">
                          Robot Fleet
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Manage and monitor your robots
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setOpen((prev) => !prev)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allRobots.map((robot) => (
                      <div
                        key={robot.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedRobot?.id === robot.id
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-600 hover:bg-slate-700/50"
                        }`}
                        onClick={() => {
                          setSelectedRobot(robot);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(robot.modelRelation.modelType)}
                            <span className="font-medium text-sm text-slate-200">
                              {robot.customName}
                            </span>
                          </div>
                          {/* <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)}`} /> */}
                        </div>
                        <div className="space-y-1 text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Battery className="w-3 h-3" />
                            <span>100%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>location</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {robot.serialNo}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {/* here */}

                {selectedRobot && (
                  <Card className="">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-slate-200">
                            Switch Control
                          </CardTitle>
                        </div>
                        <div className="flex flex-row-reverse gap-2 items-center">
                          Manual Control
                          <Switch
                            checked={
                              isUserToggling
                                ? robotStatus !== "manual"
                                : robotStatus === "manual"
                            }
                            onCheckedChange={(checked) => {
                              setIsUserToggling(true);
                              emit("robot:controlMode", {
                                mode: checked ? "manual" : "autonomous",
                                serialNo: selectedRobot.serialNo,
                              });
                            }}
                          />
                          <Button
                            onClick={() => setOpen((prev) => !prev)}
                            size="sm"
                            variant={"destructive"}
                            className="text-xs"
                          >
                            Emergency Stop
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 min-w-40 min-h-40 flex flex-col justify-center items-center">
                      <Controls toggleState={isUserToggling} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Live Feed & Controls */}
            <div className="lg:col-span-2">
              {selectedRobot && (
                <Card className="">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-200">
                          {selectedRobot.customName}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Live camera feed and controls
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

export function Controls({ toggleState }: { toggleState: boolean }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
        setActiveKey(key);
        toast.success(activeKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        setActiveKey(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isActive = (keys: string[]) => keys.includes(activeKey || "");

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${!toggleState && "cursor-not-allowed"} `}>
        <Button
          disabled={!toggleState}
          variant={isActive(["w", "arrowup"]) ? "default" : "outline"}
          size="lg"
          className={`h-12 w-12 p-0 ${!toggleState && "cusor-a"}`}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>
      <div
        className={`flex gap-3 items-center ${
          !toggleState && "cursor-not-allowed"
        }`}
      >
        <Button
          disabled={!toggleState}
          variant={isActive(["a", "arrowleft"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          disabled={!toggleState}
          variant={isActive(["s", "arrowdown"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
        <Button
          disabled={!toggleState}
          variant={isActive(["d", "arrowright"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
