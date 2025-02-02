import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>;

export const exampleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ExampleResponse = z.infer<typeof exampleResponseSchema>; 