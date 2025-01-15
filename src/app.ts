import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

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
