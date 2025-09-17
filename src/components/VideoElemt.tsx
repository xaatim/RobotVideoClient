import { useRobotStream } from "@/hooks/useRobotStream";
import { userRobots } from "@/lib/serverq";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Maximize, Pause, Play, Video, Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";
import { videoMode } from "../../types/types";

export default function VideoElemt({
  robot,
  title,
  streamUrl,
}: {
  robot: userRobots;
  title: string;
  streamUrl: string;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [zoom, setZoom] = useState([100]);

  return (
    <Card className="border border-gray-800 dark:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="bg-transparent">
              <Maximize className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? "" : "bg-transparent"}
            >
              {isRecording ? (
                <Pause className="w-4 h-4 text-foreground" />
              ) : (
                <Play className="w-4 h-4 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-background rounded-lg relative overflow-hidden">
          {streamUrl ? (
            <img
              src={streamUrl}
              className="aspect-square w-full h-full text-center"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-background flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
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
                className="bg-transparent"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-foreground" />
                )}
              </Button>
              <div className="flex items-center gap-2 min-w-[120px]">
                <span className="text-sm text-gray-400 dark:text-gray-600">
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
              <span className="text-sm text-gray-400 dark:text-gray-600">
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
              <span className="text-sm text-gray-400 dark:text-gray-600 w-12">
                {zoom[0]}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
