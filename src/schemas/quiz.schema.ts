import { z } from 'zod';

// Base schemas
const answerSchema = z.object({
  answerText: z.string().min(1, 'Answer text is required'),
  isCorrect: z.boolean(),
});

const stepSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  stepOrder: z.number().int().positive(),
  answers: z.array(answerSchema).min(2, 'At least 2 answers are required'),
});

// Create Quiz Schema
export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1, 'At least one step is required'),
});

// Update Quiz Schema
export const updateQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  description: z.string().optional(),
});

// Create User Attempt Schema
export const createAttemptSchema = z.object({
  quizId: z.string().uuid(),
});

// Submit Answer Schema
export const submitAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  stepId: z.string().uuid(),
  selectedAnswerId: z.string().uuid(),
});

// Response Types
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>; 