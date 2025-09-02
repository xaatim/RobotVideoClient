"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Video,
  Settings,
  Battery,
  Wifi,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Maximize,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import { userRobots } from "@/lib/serverq";
import { useSocket } from "./useWebsocket";
import { Controls } from "./Controls";
import useStream from "@/hooks/useStream";
import GoogleMap from "./Googlemap";

type RobotControRoomPros = {
  robot: userRobots;
};
export default function RobotControRoom({ robot }: RobotControRoomPros) {
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [zoom, setZoom] = useState([100]);
  const { on, emit } = useSocket();
  // const [streamUrl, setStreamUrl] = useState<string>("");
  const { streamUrl } = useStream(robot.serialNo);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const [robotStatus, setRobotStatus] = useState<
    "autonomous" | "manual" | null
  >(null);
  const [isUserToggling, setIsUserToggling] = useState(true);
  useEffect(() => {
    emit("robot:join", { serialNo: robot?.serialNo });
  }, [robot]);

  useEffect(() => {
    const handleStatusUpdate = (mode: "autonomous" | "manual") => {
      console.log("From client:", mode);
      setRobotStatus(mode);
      setIsUserToggling(false);
    };
    on("robot:statusUpdate", handleStatusUpdate);
    return () => {};
  }, [on, robot]);

  function handleTogeling(checked: boolean) {
    setIsUserToggling(checked);
    emit("robot:controlMode", {
      mode: checked ? "manual" : "autonomous",
      serialNo: robot?.serialNo!,
    });
  }
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(key)) {
      event.preventDefault();
      setPressedKeys((prev) => new Set(prev).add(key));
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(key)) {
      event.preventDefault();
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleDirectionalControl = (direction: string) => {
    console.log(`[v0] Robot moving ${direction}`);
  };

  if (!robot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Robot not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/user">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/user">← Back</Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {robot.customName}
                </h1>
                <p className="text-muted-foreground">
                  {robot.modelRelation.model} • {robot.modelRelation.modelType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={"default"}>Online</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Battery className="w-4 h-4" />
                90%
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wifi className="w-4 h-4" />
                100%
              </div>
            </div>
          </div>
        </div>
      </header>
    
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Stream - Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Feed */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    Live Video Feed
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? "" : "bg-transparent"}
                    >
                      {isRecording ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                  <img
                    src={streamUrl}
                    alt="Robot Stream"
                    className="aspect-square w-full h-full"
                  />
                  {!streamUrl && (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Robot Offline</p>
                        <p className="text-sm">Video feed unavailable</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-transparent"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <span className="text-sm text-muted-foreground">
                          Volume
                        </span>
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="flex-1"
                          disabled={isMuted}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="text-sm text-muted-foreground">
                        Zoom
                      </span>
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        min={50}
                        max={300}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {zoom[0]}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movement Controls */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground">
                  Movement Controls
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Use WASD keys or click buttons to control robot movement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor="autonomous-mode"
                      className="text-card-foreground"
                    >
                      Autonomous Mode
                    </Label>
                    <Switch
                      id="autonomous-mode"
                      checked={isAutonomous}
                      onCheckedChange={() => {
                        setIsAutonomous((prev) => !prev);
                        handleTogeling(isAutonomous);
                      }}
                    />
                  </div>
                  <Badge variant={isAutonomous ? "default" : "secondary"}>
                    {isAutonomous ? "Autonomous" : "Manual"}
                  </Badge>
                </div>
                {/* todo */}
                {!isAutonomous && <Controls toggleState={!isAutonomous} />}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Status & Map */}
          <div className="space-y-6">
            {/* Robot Status */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground">
                  Robot Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery Level</span>
                    <span className="text-foreground font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <Separator className="bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Signal Strength
                    </span>
                    <span className="text-foreground font-medium">{50}%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="text-foreground font-medium">{40}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-foreground font-medium text-right text-sm">
                      not yet
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPS Map */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground">
                  GPS Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg relative overflow-hidden">
                 <GoogleMap />
                </div>
                <div className="mt-3 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Full Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Screenshot
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Command
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
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
