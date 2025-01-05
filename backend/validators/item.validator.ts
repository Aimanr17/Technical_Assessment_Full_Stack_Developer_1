import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
});

export const updateItemSchema = createItemSchema.partial();
