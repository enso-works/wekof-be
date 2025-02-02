import express, { Request, Response, NextFunction } from "express";
import { json } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 8080;

// Parse JSON bodies
app.use(json());

// Swagger UI
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// API routes
app.use("/api", routes);

// Health-check endpoint
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("Server is running.");
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (must be the last middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  }
});