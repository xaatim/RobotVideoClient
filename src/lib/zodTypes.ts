import { z } from "zod";

export type RobotFormData = z.infer<typeof robotFormSchema>;
export const robotFormSchema = z.object({
  model: z.string().min(1, "Please select a robot model"),
  key: z.string().min(1, "Robot key is required"),
});
export type robotOwnershipSchemaData = z.infer<typeof robotOwnershipSchema>;

export const robotOwnershipSchema = z.object({
  serialNo: z
    .string()
    .regex(/^BR[a-zA-Z0-9]*-SN-\d+$/, { error: "wrong serial number" }),
  customName: z.string().min(5, "Robot Name is required"),
  key: z.string().min(5, "Robot Key is required"),
});

export const robotModelFormSchema = z.object({
  model: z.string().min(1, "Please select a robot model"),
  modelType: z.string().min(1, "Robot type is required"),
});
export type RobotModelFormData = z.infer<typeof robotModelFormSchema>;
