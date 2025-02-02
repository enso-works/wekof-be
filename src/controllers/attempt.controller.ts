import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import { createAttemptSchema, submitAnswerSchema, type CreateAttemptInput, type SubmitAnswerInput } from "../schemas/quiz.schema";
import { ZodError } from "zod";

// Extend Request to include user property
interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  user?: {
    id: string;
  };
}

// Ensure prisma is properly typed
const typedPrisma = prisma as PrismaClient;

export const createAttempt = async (
  req: AuthenticatedRequest<{}, any, CreateAttemptInput>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const validatedData = createAttemptSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const attempt = await typedPrisma.userAttempt.create({
      data: {
        userId,
        quizId: validatedData.quizId,
      },
      include: {
        quiz: {
          include: {
            steps: {
              include: {
                answers: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(attempt);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    next(error);
  }
};

export const submitAnswer = async (
  req: AuthenticatedRequest<{}, any, SubmitAnswerInput>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const validatedData = submitAnswerSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get the attempt and verify ownership
    const attempt = await typedPrisma.userAttempt.findUnique({
      where: { id: validatedData.attemptId },
      include: { quiz: { include: { steps: true } } }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to submit answer for this attempt' });
    }

    // Get the answer to check if it's correct
    const answer = await typedPrisma.answer.findUnique({
      where: { id: validatedData.selectedAnswerId }
    });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Create the user answer
    const userAnswer = await typedPrisma.userAnswer.create({
      data: {
        attemptId: validatedData.attemptId,
        stepId: validatedData.stepId,
        selectedAnswerId: validatedData.selectedAnswerId,
        isCorrect: answer.isCorrect
      }
    });

    // Update attempt progress
    const currentStep = attempt.quiz.steps.find((s: { id: string; stepOrder: number }) => s.id === validatedData.stepId);
    const nextStepOrder = currentStep ? currentStep.stepOrder + 1 : 1;
    const nextStep = attempt.quiz.steps.find((s: { stepOrder: number }) => s.stepOrder === nextStepOrder);

    await typedPrisma.userAttempt.update({
      where: { id: validatedData.attemptId },
      data: {
        currentStep: nextStepOrder,
        completedAt: !nextStep ? new Date() : undefined
      }
    });

    res.json(userAnswer);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    next(error);
  }
};

export const getAttemptProgress = async (
  req: AuthenticatedRequest<{ id: string }>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const attemptId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const attempt = await typedPrisma.userAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            steps: {
              include: {
                answers: true
              }
            }
          }
        },
        userAnswers: true
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    res.json(attempt);
  } catch (error) {
    next(error);
  }
}; 
