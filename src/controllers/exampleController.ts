import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { createExampleSchema, type ExampleResponse } from "../schemas/example.schema";
import { ZodError } from "zod";

type ErrorResponse = {
  message: string;
  errors?: ZodError['errors'];
};

export const getExample = async (_req: Request, res: Response<ExampleResponse[] | ErrorResponse>, next: NextFunction) => {
  try {
    const examples = await prisma.example.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.json(examples);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          message: 'A record with this email already exists' 
        });
      }
    }
    next(error);
  }
};

export const createExample = async (
  req: Request, 
  res: Response<ExampleResponse | ErrorResponse>, 
  next: NextFunction
) => {
  try {
    const validatedData = createExampleSchema.parse(req.body);
    
    const example = await prisma.example.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json(example);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          message: 'A record with this email already exists' 
        });
      }
    }
    next(error);
  }
}; 