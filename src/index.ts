import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { Request, Response } from "express";
import dbConnection from "./database/config/config"
import router from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", router);
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the URL very well!",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Fixo Backend",
  });
});

const PORT = process.env.PORT || 3000;

dbConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error);
  });
