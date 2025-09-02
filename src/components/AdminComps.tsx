"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Plus,
  RefreshCw,
  Loader2,
  Bot,
  Users,
  Database,
  Minus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  addNewModel,
  type allModels,
  createRobot,
  deleteRobot,
  type robot,
} from "@/lib/serverq";
import { RobotModelDropDown } from "./RobotModelDropDown";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  type RobotFormData,
  robotFormSchema,
  type RobotModelFormData,
  robotModelFormSchema,
} from "@/lib/zodTypes";
import { generateRandomKey } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import ProfileComps from "./ProfileComps";

export default function AdminDashboard({
  intiRobots,
  Models,
}: {
  intiRobots: robot[];
  Models: allModels;
}) {
  const [newMdlToggle, setNewMdlToggle] = useState(false);
  const router = useRouter();
  const totalRobots = intiRobots.length;
  const ownedRobots = intiRobots.filter((robot) => robot.owner?.name).length;
  const availableModels = Models.length;
  const latestRobotRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (latestRobotRef.current) {
      latestRobotRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [intiRobots]);
  const robotForm = useForm<RobotFormData>({
    resolver: zodResolver(robotFormSchema),
    defaultValues: {
      model: "",
      key: generateRandomKey(),
    },
  });

  const robotModelform = useForm<RobotModelFormData>({
    resolver: zodResolver(robotModelFormSchema),
    defaultValues: {
      model: "",
      modelType: "",
    },
  });
  const { mutateAsync: addModel, isPending: isLoading } = useMutation({
    mutationFn: addNewModel,
    onSuccess: () => {
      toast.success("Successfully added model", { id: "add-model" });
      router.refresh();
      robotModelform.reset();
      setNewMdlToggle(false);
    },
    onError: (e) => {
      toast.error(e.message, { id: "add-model" });
    },
  });
  const { mutateAsync: createRobotMuta, isPending } = useMutation({
    mutationFn: createRobot,
    onSuccess: () => {
      toast.success("Successfully added robot", { id: "add-robot" });
      router.refresh();
      robotForm.reset();
      setNewMdlToggle(false);
    },
    onError: (e) => {
      toast.error(e.message, { id: "add-robot" });
    },
  });
  const { mutateAsync: deleteRobotMutate, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteRobot,
      onSuccess: () => {
        toast.success("successfully deleted", { id: "delete-robot" });
        router.refresh();
      },
      onError: (er) => {
        toast.error(er.message);
      },
    }
  );
  async function onRobotSubmit(data: RobotFormData) {
    toast.loading("adding model..", { id: "add-robot" });
    await createRobotMuta({
      model: data.model,
      robotKey: data.key,
    });
    router.refresh();
    robotForm.setValue("key", generateRandomKey());
  }
  async function onRobotModelSubmit(data: RobotModelFormData) {
    toast.loading("adding model..", { id: "add-model" });
    await addModel({ model: data.model, modelType: data.modelType });
    router.refresh();
  }

  const handleGenerateKey = () => {
    robotForm.setValue("key", generateRandomKey());
  };

  return (
    <div className="w-full h-full text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your robot inventory and models
              </p>
            </div>
            <ProfileComps />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Robots
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRobots}</div>
              <p className="text-xs text-muted-foreground">
                {totalRobots === 0 ? "No robots yet" : "robots in inventory"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Models
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableModels}</div>
              <p className="text-xs text-muted-foreground">
                {availableModels === 0 ? "No models available" : "model types"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="">
            <CardHeader>
              <div className="flex justify-between w-full">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Robot Management
                  </CardTitle>
                  <CardDescription>
                    Create new robots and manage models
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setNewMdlToggle((prev) => !prev)}
                  variant="outline">
                  {newMdlToggle ? (
                    <Minus className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Model
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col">
              {newMdlToggle && (
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-4">Add New Robot Model</h4>
                  <form
                    onSubmit={robotModelform.handleSubmit(onRobotModelSubmit)}
                    className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">Robot Model</Label>
                      <div className="flex gap-2">
                        <Input
                          id="model"
                          {...robotModelform.register("model")}
                          placeholder="Robot Model"
                          className={
                            robotModelform.formState.errors.model
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                      {robotModelform.formState.errors.model && (
                        <p className="text-sm text-red-500">
                          {robotModelform.formState.errors.model.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelType">Robot Model Type</Label>
                      <div className="flex gap-2">
                        <Input
                          id="modelType"
                          {...robotModelform.register("modelType")}
                          placeholder="Robot Model Type"
                          className={
                            robotModelform.formState.errors.modelType
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                      {robotModelform.formState.errors.modelType && (
                        <p className="text-sm text-red-500">
                          {robotModelform.formState.errors.modelType.message}
                        </p>
                      )}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Creating
                          </>
                        ) : (
                          "Create new Robot Model"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="">
                <h4 className="font-medium mb-4">Create New Robot</h4>
                <form
                  onSubmit={robotForm.handleSubmit(onRobotSubmit)}
                  className="space-y-4 flex flex-col">
                  <RobotModelDropDown allModels={Models} form={robotForm} />

                  <div className="space-y-2">
                    <Label htmlFor="key">Robot Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="key"
                        {...robotForm.register("key")}
                        placeholder="Generated key"
                        readOnly
                        className={
                          robotForm.formState.errors.key ? "border-red-500" : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleGenerateKey}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    {robotForm.formState.errors.key && (
                      <p className="text-sm text-red-500">
                        {robotForm.formState.errors.key.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2"></div>
                </form>
              </div>
            </CardContent>
            <CardFooter className="w-full ">
              <form
                onSubmit={robotForm.handleSubmit(onRobotSubmit)}
                className="w-full ">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  {"Add Robot"}
                </Button>
              </form>
            </CardFooter>
          </Card>

          <Card className="max-h-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Robot Inventory
              </CardTitle>
              <CardDescription>
                {totalRobots > 0
                  ? `${totalRobots} robots • ${ownedRobots} owned`
                  : "No robots in inventory"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {intiRobots.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No robots yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first robot using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <ScrollArea className="flex flex-col h-70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Model</TableHead>
                          <TableHead>Serial No</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {intiRobots.map((robot) => (
                          <TableRow key={robot.id} ref={latestRobotRef}>
                            <TableCell className="font-medium">
                              {robot.modelRelation.model}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {robot.serialNo}
                            </TableCell>
                            <TableCell>
                              {robot.owner?.name ? (
                                <span className="text-foreground">
                                  {robot.owner.name}
                                </span>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  Unassigned
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                disabled={isDeleting}
                                size="sm"
                                variant="ghost"
                                onClick={async () =>
                                  deleteRobotMutate(robot.serialNo)
                                }>
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
