"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
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
} from "lucide-react";
import Link from "next/link";
import { userRobots } from "@/lib/serverq";
import { useSocketIo } from "../hooks/useSocketIo";
import GoogleMap from "./Googlemap";
import { Controller } from "./Controls";
import { useRobotStream } from "../hooks/useRobotStream";
import { useRobotStatus } from "@/hooks/useRobotStatus";

type RobotControRoomPros = {
  intialRobot: userRobots;
};
export default function RobotControRoom({ intialRobot }: RobotControRoomPros) {
  const [robot] = useState(intialRobot);
  const streamUrl = useRobotStream(robot);
  const { status, toggleMode } = useRobotStatus(robot?.serialNo);
  const [isAutonomous, setIsAutonomous] = useState(status === "autonomous");
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [zoom, setZoom] = useState([100]);

  function handleToggling(checked: boolean) {
    toggleMode(checked);
  }

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
          <div className="lg:col-span-2 space-y-6">
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
                      className="bg-transparent">
                      <Maximize className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? "" : "bg-transparent"}>
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
                  {streamUrl ? (
                    <img
                      src={streamUrl}
                      className="aspect-square w-full h-full text-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Robot Offline</p>
                        <p className="text-sm">Video feed unavailable</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-transparent">
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

            <Controller
              handleTogeling={handleToggling}
              isAutonomous={isAutonomous}
              setIsAutonomous={setIsAutonomous}
            />
          </div>

          <div className="space-y-6">
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
                    className="bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Full Map
                  </Button>
                </div>
              </CardContent>
            </Card>

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
