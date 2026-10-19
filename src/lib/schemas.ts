import { z } from "zod";
import { AREAS, CATEGORIES, PICKUP } from "@/types";

export const listingSchema = z.object({
  category: z.enum(CATEGORIES),
  brand: z.string().trim().min(2, "Enter the brand").max(40),
  model: z.string().trim().min(2, "Enter the exact model").max(60),
  title: z.string().trim().min(8, "Give it a short, clear title").max(80),
  description: z.string().trim().max(600).default(""),
  faults: z.string().trim().min(3, "Tell buyers what's wrong"),
  workingParts: z.string().trim().default(""),
  price: z.coerce.number().int().min(1000, "Minimum is ₦1,000").max(10_000_000, "That's too high for this demo"),
  area: z.enum(AREAS),
  pickup: z.enum(PICKUP),
});
export type ListingInput = z.infer<typeof listingSchema>;

export const requestSchema = z
  .object({
    category: z.enum(CATEGORIES),
    brand: z.string().trim().min(2, "Enter the brand").max(40),
    model: z.string().trim().min(2, "Enter the exact model").max(60),
    component: z.string().trim().min(2, "Which part do you need?").max(60),
    details: z.string().trim().max(400).default(""),
    budgetMin: z.coerce.number().int().min(0),
    budgetMax: z.coerce.number().int().min(500, "Set a max budget"),
    area: z.enum(AREAS),
  })
  .refine((v) => v.budgetMax >= v.budgetMin, { message: "Max must be at least the min", path: ["budgetMax"] });
export type RequestInput = z.infer<typeof requestSchema>;

export const splitList = (s: string) => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
