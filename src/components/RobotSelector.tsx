import { Activity, Battery, GraduationCap, MapPin, Plus, Shield, Sprout } from "lucide-react";
import { Controls } from "./Controls";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { userRobots } from "@/lib/serverq";
import RobotOwnershipDialog from "./RobotOwnershipDialog";

type RobotSelectorProps = {
  allRobots: userRobots[];
  selectedRobot: userRobots;
  setSelectedRobot: (robot: userRobots) => void;
  isUserToggling: boolean;
  handleTogeling: (b: boolean) => void;
};
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

export function RobotSelector({
  isUserToggling,
  allRobots,
  selectedRobot,
  setSelectedRobot,
  handleTogeling,
}: RobotSelectorProps) {
  const [open, setOpen] = useState(false);
  return (

    <div className="lg:col-span-1">
      
      <div className="flex flex-col gap-3">
        <Card className="">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-200">Robot Fleet</CardTitle>
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
                    onCheckedChange={(checked) => {
                      handleTogeling(checked);
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
  );
}
