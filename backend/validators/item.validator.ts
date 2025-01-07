import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive()
});

export const updateItemSchema = createItemSchema.partial();