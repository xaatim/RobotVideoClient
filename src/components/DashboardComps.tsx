"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import VideoWebsocket from "@/components/WebsocketVideo";
import {
  Battery,
  Wifi,
  Thermometer,
  Gauge,
  MapPin,
  Activity,
  Power,
  Settings,
  Camera,
  Zap,
} from "lucide-react";
import { useState } from "react";
export type Connecting = "connected" | "disconnected" | "connecting";
export default function DashboardComps({ userId }: { userId: string }) {
  const [connected, setConnected] = useState<Connecting>("disconnected");
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Robot Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and control your robot device
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                connected === "connected"
                  ? "bg-green-500"
                  : connected === "connecting"
                  ? "bg-gray-400"
                  : "bg-red-500"
              }`}
            />
            {connected}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Video Stream
              </CardTitle>
              <CardDescription>
                Real-time video feed from your robot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <VideoWebsocket
                  userId={userId}
                  connected={connected}
                  setConnection={setConnected}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Snapshot
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Camera Settings
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    <span className="text-sm">Battery</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">78%</div>
                    <Progress value={78} className="w-16 h-2" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Signal</span>
                  </div>
                  <Badge variant="secondary">Strong</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="text-sm font-medium">42°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Power</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Normal
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latitude:</span>
                    <span className="font-mono">40.7128</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Longitude:</span>
                    <span className="font-mono">-74.0060</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altitude:</span>
                    <span className="font-mono">10.2m</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent">
                  View on Map
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Motor Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Left Motor</span>
                <Badge variant="outline">85%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Right Motor</span>
                <Badge variant="outline">82%</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                <Power className="w-4 h-4 mr-2" />
                Emergency Stop
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sensors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ultrasonic</span>
                <span className="text-sm font-mono">1.2m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gyroscope</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>34%</span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent">
                Calibrate Sensors
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent">
                Run Diagnostics
              </Button>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
