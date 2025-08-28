"use client";

import { useState, useTransition } from "react";
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
import { FieldErrors, useForm } from "react-hook-form";
import { dbTypes } from "../../drizzle/queries";
import { toast } from "sonner";
import { createRobot } from "@/lib/serverq";
import { useRouter } from "next/navigation";

interface Robot {
  id: string;
  name: string;
  key: string;
}

const generateRandomKey = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export default function AdminDashboard({
  intiRobots,
}: {
  intiRobots: dbTypes["Robots"];
}) {
  const [robots, setRobots] = useState(intiRobots);
  const [editingRobotId, setEditingRobotId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { register, handleSubmit, reset, setValue } =
    useForm<Omit<Robot, "id">>();

  useState(() => {
    setValue("key", generateRandomKey());
  });

  const onSubmit = async (data: Omit<Robot, "id">) => {
    try {
      setIsPending(true);
      const result = await createRobot(data.name, data.key);
      if (result.success) {
        toast.success("secceefully added");
        setRobots((prev) => [...prev, result.result]);
      }
      setIsPending(false);
    } catch (error) {
      setIsPending(false);

      toast.error("names have to be unique try again");
    }
  };
  const onError = async (errors: FieldErrors<Omit<Robot, "id">>) => {
    toast.error("Please fix the errors in the form");
  };

  const handleCancel = () => {
    setEditingRobotId(null);
    reset();
    setValue("key", generateRandomKey());
  };

  const handleGenerateKey = () => {
    setValue("key", generateRandomKey());
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
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingRobotId ? "Edit Robot" : "Add New Robot"}
              </CardTitle>
              <CardDescription>
                {editingRobotId
                  ? "Update robot information"
                  : "Create a new robot entry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Robot Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    placeholder="Enter robot name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Robot Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="key"
                      {...register("key", { required: true })}
                      placeholder="Generated key"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGenerateKey}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending && <Loader2 className="animate-spin" />}
                    {editingRobotId ? "Update Robot" : "Add Robot"}
                  </Button>
                  {editingRobotId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
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
              {robots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No robots added yet. Create your first robot using the form.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {robots.map((robot) => (
                      <TableRow key={robot.id}>
                        <TableCell className="font-medium">
                          {robot.id}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {robot.key}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {}}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toast.success("deleted")}>
                              <Trash2 className="h-4 w-4" />
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
