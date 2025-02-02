/**
 * @swagger
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The answer ID
 *         answerText:
 *           type: string
 *           description: The text of the answer
 *         isCorrect:
 *           type: boolean
 *           description: Whether this answer is correct
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the answer was created
 * 
 *     Step:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The step ID
 *         questionText:
 *           type: string
 *           description: The question text
 *         stepOrder:
 *           type: integer
 *           minimum: 1
 *           description: The order of this step in the quiz
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Answer'
 *           minItems: 2
 *           description: List of possible answers
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the step was created
 * 
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The quiz ID
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: The quiz title
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional quiz description
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Step'
 *           description: List of quiz steps
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the quiz was created
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Error code
 *               message:
 *                 type: string
 *                 description: Detailed error message
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Path to the error in the request body
 *           description: Validation errors if any
 */

// This file only contains Swagger documentation
export {}; 