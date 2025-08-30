"use client";

import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {  type allModels } from "@/lib/serverq";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { RobotFormData, robotOwnershipSchemaData } from "@/lib/zodTypes";
export interface robotType {
  id: string;
  model: string;
  key: string;
  serialNo: string;
}

interface RobotModelDropDownProps {
  key?: "admin" | "user";
  allModels: allModels;
  form: UseFormReturn<RobotFormData >;
  onChange?:(s:string)=>void
}

export function RobotModelDropDown({
  allModels,
  form,
  key = "admin",
}: RobotModelDropDownProps) {
  const [open, setOpen] = useState(false);

  const currentValue = form.watch("model");
  const fieldError = form.formState.errors.model;
  const models = allModels.map((mod) => {
    return { value: mod.id, label: mod.model };
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Robot Model</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              fieldError && "border-red-500"
            )}
          >
            {currentValue
              ? models.find((model) => model.label === currentValue)?.label
              : "Select robot model..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search models..."
            />
            <CommandList>
              <CommandEmpty>
                no model yet
              </CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.value}
                    value={model.label}
                    onSelect={(selectedValue) => {
                      const newValue =
                        selectedValue === currentValue ? "" : selectedValue;
                      form.setValue("model", newValue);
                      if (newValue) {
                        form.clearErrors("model");
                      }

                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentValue === model.label
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {model.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {fieldError && (
        <p className="text-sm text-red-500">{fieldError.message}</p>
      )}
    </div>
  );
}
