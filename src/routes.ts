import express, { Request, Response, NextFunction } from "express";
import * as quizController from "./controllers/quiz.controller";
import * as attemptController from "./controllers/attempt.controller";

const router = express.Router();

// Quiz routes
router.get("/quizzes", quizController.getQuizzes);
router.get("/quizzes/:id", quizController.getQuizById);
router.post("/quizzes", quizController.createQuiz);
router.put("/quizzes/:id", quizController.updateQuiz);
router.delete("/quizzes/:id", quizController.deleteQuiz);

// Quiz attempt routes
router.post("/attempts", attemptController.createAttempt);
router.post("/attempts/answer", attemptController.submitAnswer);
router.get("/attempts/:id", attemptController.getAttemptProgress);

export default router;
