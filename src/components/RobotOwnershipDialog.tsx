import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { robotOwnershipSchema, robotOwnershipSchemaData } from "@/lib/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRobotOwnerShip } from "@/lib/serverq";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";

import { Input } from "./ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RobotOwnershipDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const session = authClient.useSession().data;
  const router = useRouter();
  const robotOwnershipForm = useForm<robotOwnershipSchemaData>({
    resolver: zodResolver(robotOwnershipSchema),
    defaultValues: {
      key: "",
      customName: "",
      serialNo: "",
    },
  });
  const { mutateAsync: addRobot, isPending } = useMutation({
    mutationFn: updateRobotOwnerShip,
    onSuccess: () => {
      toast.success("successfully added", { id: "robot-ownership" });
      router.refresh();
      setOpen((prev) => !prev);
    },
    onError: (er) => {
      toast.error(er.message, { id: "robot-ownership" });
    },
  });
  async function onSubmit(data: robotOwnershipSchemaData) {
    toast.loading("assigning...", { id: "robot-ownership" });
    await addRobot({ values: data, userId: session?.user.id! });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Robot Registration</DialogTitle>
          <DialogDescription>
            Enter your robot's details to enable monitoring features
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={robotOwnershipForm.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber" className="">
                  Serial Number
                </Label>
                <Input
                  {...robotOwnershipForm.register("serialNo")}
                  type="text"
                  placeholder="BR-2024-XXXX-XXXX"
                  className={
                    robotOwnershipForm.formState.errors.key
                      ? "border-red-500"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Found on your robot's identification label
                </p>
              </div>
              {robotOwnershipForm.formState.errors.serialNo && (
                <p className="text-sm text-red-500">
                  {robotOwnershipForm.formState.errors.serialNo.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="grid gap-2">
                <Label htmlFor="productName" className="">
                  Product Name
                </Label>
                <Input
                  {...robotOwnershipForm.register("customName")}
                  type="text"
                  placeholder="My Security Robot"
                  className={
                    robotOwnershipForm.formState.errors.customName
                      ? "border-red-500"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Choose a name to identify this robot
                </p>
              </div>
              {robotOwnershipForm.formState.errors.customName && (
                <p className="text-sm text-red-500">
                  {robotOwnershipForm.formState.errors.customName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="grid gap-2">
                <Label htmlFor="productKey" className="">
                  Product Key
                </Label>
                <Input
                  id="productKey"
                  type="text"
                  {...robotOwnershipForm.register("key")}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className={
                    robotOwnershipForm.formState.errors.key
                      ? "border-red-500"
                      : ""
                  }
                />
                <p className="text-xs text-slate-500">
                  16+ character activation key included with your robot
                </p>
              </div>
              {robotOwnershipForm.formState.errors.key && (
                <p className="text-sm text-red-500">
                  {robotOwnershipForm.formState.errors.key.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}Register Robot
            </Button>
          </div>

          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h3 className="text-sm font-medium  mb-2">What happens next?</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Your robot will appear in your dashboard</li>
              <li>• Live camera feeds will be available</li>
              <li>• Real-time status monitoring enabled</li>
              <li>• Remote control features activated</li>
            </ul>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
