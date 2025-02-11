import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import route from "./routes";
import { connectToDB, disconnectFromDB } from "./config/database";

const port = process.env.PORT || 7000;

const app = express();
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hi");
});
app.use(cors());
app.use(express.json());
app.use(route);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager Api",
      version: "1.0.0",
      description: "API documentation using swagger",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async (): Promise<void> => {
  try {
    await connectToDB();
    app.listen(port, () => {
      console.log("Server started ");
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};
startServer().catch(console.error);

process.on("SIGINT", async () => {
  try {
    await disconnectFromDB();
    process.exit(0);
  } catch (error) {
    console.error("Failed to disconnect from database :", error);
    process.exit(1);
  }
});

export default app;
