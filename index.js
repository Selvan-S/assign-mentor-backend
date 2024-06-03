import cors from "cors";
import express from "express";
import { dbConnection } from "./db.js";
import { mentorRouter } from "./routes/mentor.js";
import { studentRouter } from "./routes/student.js";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
app.use(express.json());

app.use(cors());

// Apply Middleware
dbConnection(MONGODB_CONNECTION_STRING);
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use("/api/v1/mentor", mentorRouter);
app.use("/api/v1/student", studentRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
