import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import { createQuizSchema, updateQuizSchema, type CreateQuizInput, type UpdateQuizInput } from "../schemas/quiz.schema";
import { ZodError } from "zod";

type ErrorResponse = {
  message: string;
  errors?: ZodError['errors'];
};

// Ensure prisma is properly typed
const typedPrisma = prisma as PrismaClient;

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     tags: 
 *       - Quizzes
 *     summary: Get all quizzes
 *     description: Retrieve a list of all available quizzes with their steps and answers
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 */
export const getQuizzes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await typedPrisma.quiz.findMany({
      include: {
        steps: {
          include: {
            answers: true
          }
        }
      }
    });
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     tags:
 *       - Quizzes
 *     summary: Get a quiz by ID
 *     description: Retrieve a specific quiz with all its steps and answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getQuizById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const quiz = await typedPrisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        steps: {
          include: {
            answers: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     tags:
 *       - Quizzes
 *     summary: Create one or multiple quizzes
 *     description: Create either a single quiz or multiple quizzes with their steps and answers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - title
 *                   - steps
 *                 properties:
 *                   title:
 *                     type: string
 *                     maxLength: 255
 *                   description:
 *                     type: string
 *                   steps:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Step'
 *                     minItems: 1
 *               - type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - steps
 *                   properties:
 *                     title:
 *                       type: string
 *                       maxLength: 255
 *                     description:
 *                       type: string
 *                     steps:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Step'
 *                       minItems: 1
 *     responses:
 *       201:
 *         description: Quiz(zes) created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Quiz'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createQuiz = async (req: Request<{}, {}, CreateQuizInput | CreateQuizInput[]>, res: Response, next: NextFunction) => {
  try {
    if (Array.isArray(req.body)) {
      // Handle array of quizzes
      const validatedData = req.body.map(quiz => createQuizSchema.parse(quiz));
      
      const quizzes = await typedPrisma.$transaction(
        validatedData.map(quizData => 
          typedPrisma.quiz.create({
            data: {
              title: quizData.title,
              description: quizData.description,
              steps: {
                create: quizData.steps.map(step => ({
                  questionText: step.questionText,
                  stepOrder: step.stepOrder,
                  answers: {
                    create: step.answers
                  }
                }))
              }
            },
            include: {
              steps: {
                include: {
                  answers: true
                }
              }
            }
          })
        )
      );

      res.status(201).json(quizzes);
    } else {
      // Handle single quiz
      const validatedData = createQuizSchema.parse(req.body);
      
      const quiz = await typedPrisma.quiz.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          steps: {
            create: validatedData.steps.map(step => ({
              questionText: step.questionText,
              stepOrder: step.stepOrder,
              answers: {
                create: step.answers
              }
            }))
          }
        },
        include: {
          steps: {
            include: {
              answers: true
            }
          }
        }
      });

      res.status(201).json(quiz);
    }
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

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     tags:
 *       - Quizzes
 *     summary: Update a quiz
 *     description: Update a quiz's title or description
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const updateQuiz = async (
  req: Request<{ id: string }, {}, UpdateQuizInput>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const validatedData = updateQuizSchema.parse(req.body);
    
    const quiz = await typedPrisma.quiz.update({
      where: { id: req.params.id },
      data: validatedData,
      include: {
        steps: {
          include: {
            answers: true
          }
        }
      }
    });

    res.json(quiz);
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

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     tags:
 *       - Quizzes
 *     summary: Delete a quiz
 *     description: Delete a quiz and all its associated steps and answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quiz ID
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteQuiz = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await typedPrisma.quiz.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 
