"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Trash2, Edit, Plus, RefreshCw, Loader2 } from "lucide-react";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  addNewModel,
  type allModels,
  createRobot,
  deleteRobot,
  robot,
} from "@/lib/serverq";
import { RobotModelDropDown } from "./RobotModelDropDown";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  RobotFormData,
  robotFormSchema,
  RobotModelFormData,
  robotModelFormSchema,
} from "@/lib/zodTypes";
import { generateRandomKey } from "@/lib/utils";

export default function AdminDashboard({
  intiRobots,
  Models,
}: {
  intiRobots: robot[];
  Models: allModels;
}) {
  const [newMdlToggle, setNewMdlToggle] = useState(false);
  const [selectedMode]= useState()
  const router = useRouter();
  const robotForm = useForm<RobotFormData>({
    resolver: zodResolver(robotFormSchema),
    defaultValues: {
      model: "",
      key: generateRandomKey(),
    },
  });
  const currentValue = robotForm.watch("model");

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  Robot Details
                </CardTitle>
                <Button onClick={() => setNewMdlToggle((prev) => !prev)}>
                  <Plus />
                  Add Robot Model
                </Button>
              </div>
              <CardDescription>Create a new robot entry</CardDescription>
            </CardHeader>
            <CardContent>
              {newMdlToggle && (
                <form
                  onSubmit={robotModelform.handleSubmit(onRobotModelSubmit)}
                  className="space-y-4 mb-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="key">Robot Model</Label>
                    <div className="flex gap-2">
                      <Input
                        id="key"
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
                    <Label htmlFor="key">Robot Model Type</Label>
                    <div className="flex gap-2">
                      <Input
                        id="key"
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
                    <Button type="submit" className="w-full">
                      Create new Robot Model{" "}
                    </Button>
                  </div>
                </form>
              )}
              <form
                onSubmit={robotForm.handleSubmit(onRobotSubmit)}
                className="space-y-4"
              >
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
                      onClick={handleGenerateKey}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  {robotForm.formState.errors.key && (
                    <p className="text-sm text-red-500">
                      {robotForm.formState.errors.key.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {isPending && (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    )}
                    {"Add Robot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Robots List</CardTitle>
              <CardDescription>Manage your robot inventory</CardDescription>
            </CardHeader>
            <CardContent>
              {intiRobots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No robots added yet. Create your first robot using the form.
                </div>
              ) : (
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
                      <TableRow key={robot.id}>
                        <TableCell className="font-mono text-sm">
                          {robot.modelRelation.model}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {robot.serialNo}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {robot.owner?.name
                            ? robot.owner?.name
                            : "Not owned yet"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              disabled={isDeleting}
                              size="sm"
                              variant="ghost"
                              onClick={async () =>
                                deleteRobotMutate(robot.serialNo)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              {isDeleting && (
                                <Loader2 className="animate-spin" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
