"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Eye,
  Settings,
  MapPin,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { userRobots } from "@/lib/serverq";
import RobotOwnershipDialog from "./RobotOwnershipDialog";
import ProfileComps from "./ProfileComps";

type RobotCompsProps = {
  robots: userRobots[];
};
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Surveillance":
      return <Eye className="w-5 h-5" />;
    case "Agricultural":
      return <Zap className="w-5 h-5" />;
    case "Exam Guard":
      return <Settings className="w-5 h-5" />;
    default:
      return <Settings className="w-5 h-5" />;
  }
};
export default function RobotComps({ robots }: RobotCompsProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-full text-foreground">
      <RobotOwnershipDialog open={open} setOpen={setOpen} />
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Robot Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and control your robot fleet
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Register Robot
              </Button>
              <ProfileComps />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {robots.length}
              </div>
              <p className="text-muted-foreground">Total Robots</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-500">online</div>
              <p className="text-muted-foreground">Online</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-500">100%</div>
              <p className="text-muted-foreground">Avg Battery</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-500"></div>
              <p className="text-muted-foreground">Active Tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Robots Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">My Robots</h2>
            <Badge variant="secondary" className="text-sm">
              {robots.length} registered
            </Badge>
          </div>

          {robots.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No robots registered yet</p>
                  <p className="text-sm">
                    Click "Register Robot" to add your first robot
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {robots.map((robot) => (
                <Card
                  key={robot.id}
                  className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {getTypeIcon(robot.modelRelation.modelType)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-card-foreground">
                            {robot.customName}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {robot.serialNo}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs">online</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {"Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Battery:</span>
                        <span className="text-foreground">{"10"}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Last Seen:
                        </span>
                        <span className="text-foreground">{"12h"}</span>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/user/${robot.id}`}>
                          <Video className="w-4 h-4 mr-2" />
                          Control
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
