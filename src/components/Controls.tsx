"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Pause,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { keyTpes } from "@/lib/utils";

interface ControllerProps {
  isAutonomous: boolean;
  setIsAutonomous: Dispatch<SetStateAction<boolean>>;
  handleTogeling: (state: boolean) => void;
  hanleTwist: (key: keyTpes) => void;
}

const keys: keyTpes[] = [
  "a",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "d",
  "s",
  "w",
];
export function Controller({
  isAutonomous,
  setIsAutonomous,
  handleTogeling,
  hanleTwist,
}: ControllerProps) {
  const [activeKey, setActiveKey] = useState<keyTpes | null>(null);

  console.log("aut:", isAutonomous);
  useEffect(() => {
    if (isAutonomous) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressed = e.key.toLowerCase() as keyTpes;
      if (keys.includes(pressed)) {
        hanleTwist(pressed);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() as keyTpes;
      if (keys.includes(key)) {
        setActiveKey(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isAutonomous,hanleTwist]);

  const isActive = (keys: string[]) => keys.includes(activeKey || "");

  return (
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
            <Label htmlFor="autonomous-mode" className="text-card-foreground">
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

        {!isAutonomous && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                size="lg"
                variant={isActive(["w", "arrowup"]) ? "default" : "outline"}
                className="w-16 h-16 bg-transparent"
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant={isActive(["a", "arrowleft"]) ? "default" : "outline"}
                  className="w-16 h-16 bg-transparent"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant={isActive(["s", "arrowdown"]) ? "default" : "outline"}
                  className="w-16 h-16 bg-transparent"
                >
                  <ArrowDown className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant={
                    isActive(["d", "arrowright"]) ? "default" : "outline"
                  }
                  className="w-16 h-16 bg-transparent"
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" className="bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Rotate Left
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate Right
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Press W/A/S/D keys for keyboard control
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
