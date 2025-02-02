import express, { Request, Response, NextFunction } from "express";
import { getExample, createExample } from "./controllers/exampleController";

const router = express.Router();

// GET /api/example
router.get("/example", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await getExample(_req, res, next);
  } catch (error) {
    next(error);
  }
});

// POST /api/example
router.post("/example", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createExample(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router; 
