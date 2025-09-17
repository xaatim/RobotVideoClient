"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRobotStatus } from "@/hooks/useRobotStatus";
import { useSocketIo } from "@/hooks/useSocketIo";
import { userRobots } from "@/lib/serverq";
import { keyTpes } from "@/lib/utils";
import { Battery, Camera, MapPin, Mic, Settings, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { videoMode } from "../../types/types";
import { Controller } from "./Controls";
import GoogleMap from "./Googlemap";
import VideoElemt from "./VideoElemt";
import { useRobotStream } from "@/hooks/useRobotStream";

type RobotControRoomPros = {
  intialRobot: userRobots;
};

export default function RobotControRoom({ intialRobot }: RobotControRoomPros) {
  const [robot] = useState(intialRobot);
  const { status, toggleRobotControl, setRobotTwist } = useRobotStatus(
    robot?.serialNo
  );
  const [videoMode, setVideoMode] = useState<videoMode>("live_frame");
  const streamUrl = useRobotStream({ selectedRobot: robot, videoMode });
  const { emit, off } = useSocketIo();

  useEffect(() => {
    console.log("this hapened");
    function senMode() {
      emit("robot:videoMode", {
        vidoeMode: videoMode,
        serialNo: robot.serialNo,
      });
    }
    senMode();
    return () => {
      off("robot:videoMode", senMode);
    };
  }, [videoMode]);

  const [isAutonomous, setIsAutonomous] = useState(status !== "autonomous");

  function handleRobotMove(pressed: keyTpes) {
    console.log("pressed ", pressed);
    switch (pressed) {
      case "w":
      case "arrowup":
        setRobotTwist({ z: 0.0, x: 1 });
        break;
      case "s":
      case "arrowdown":
        setRobotTwist({ z: 0.0, x: -1 });
        break;
      case "a":
      case "arrowleft":
        setRobotTwist({ z: 1.5, x: 0.0 });
        break;
      case "d":
      case "arrowright":
        setRobotTwist({ z: -1.5, x: 0.0 });
        break;
      default:
        setRobotTwist({ z: 0.0, x: 0.0 });
        break;
    }
  }

  function handleRobot(checked: boolean) {
    toggleRobotControl(checked);
  }

  if (!robot) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-500">
        <Card className="border border-gray-800 dark:border-gray-300">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 dark:text-gray-600">Robot not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/user">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-gray-800 dark:border-gray-300 backdrop-blur-sm transition-colors duration-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild className=" bg-transparent ">
                <Link href="/dashboard/user">← Back</Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{robot.customName}</h1>
                <p className="text-gray-400 dark:text-gray-600">
                  {robot.modelRelation.model} • {robot.modelRelation.modelType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={"default"}>Online</Badge>
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600">
                <Battery className="w-4 h-4" />
                90%
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600">
                <Wifi className="w-4 h-4" />
                100%
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 ">
            <Tabs defaultValue="live_feed">
              <TabsList className="w-full">
                <TabsTrigger
                  className="w-full"
                  value="live_feed"
                  onClick={() => setVideoMode("live_frame")}
                >
                  Video Feed
                </TabsTrigger>
                <TabsTrigger
                  className="w-full"
                  value="rec_feed"
                  onClick={() => setVideoMode("rec_frames")}
                >
                  Recognition Feed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="live_feed">
                <VideoElemt
                  robot={robot}
                  title="Live Video Feed"
                  streamUrl={streamUrl}
                />
              </TabsContent>
              <TabsContent value="rec_feed">
                <VideoElemt
                  robot={robot}
                  title="Live Recognition Feed"
                  streamUrl={streamUrl}
                />
              </TabsContent>
            </Tabs>

            <Controller
              hanleTwist={handleRobotMove}
              handleTogeling={handleRobot}
              isAutonomous={isAutonomous}
              setIsAutonomous={setIsAutonomous}
            />
          </div>

          <div className="space-y-6">
            <Card className="bg-background border border-gray-800 dark:border-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground">
                  Robot Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-600">
                      Battery Level
                    </span>
                    <span className="text-foreground font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <Separator className="bg-gray-800 dark:bg-gray-300" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-600">
                      Signal Strength
                    </span>
                    <span className="text-foreground font-medium">{50}%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <Separator className="bg-gray-800 dark:bg-gray-300" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-600">
                      Temperature
                    </span>
                    <span className="text-foreground font-medium">{40}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-600">
                      Location
                    </span>
                    <span className="text-foreground font-medium text-right text-sm">
                      not yet
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 dark:border-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground">
                  GPS Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-black dark:bg-white rounded-lg relative overflow-hidden">
                  <GoogleMap />
                </div>
                <div className="mt-3 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent  text-white dark:text-black"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-foreground" />
                    View Full Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-gray-800 dark:border-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark:text-white text-black">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3  text-foreground">
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2 text-foreground" />
                  Take Screenshot
                </Button>
                <Button variant="outline" className="w-full">
                  <Mic className="w-4 h-4 mr-2 text-foreground" />
                  Voice Command
                </Button>
                <Button variant="outline" className=" w-full ">
                  <Settings className="w-4 h-4 mr-2 text-foreground" />
                  Robot Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
