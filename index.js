import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect_DB } from "./config/db_connection.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import attendanceRouter from "./routes/attendance.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.routes.js";
import { authorizeRole } from "./middlewares/authorizeRole.middleware.js";
import "./jobs/attendance.job.js";
import reportRouter from "./routes/report.routes.js";

// loads env variables
dotenv.config();
const PORT = process.env.PORT;

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

connect_DB();

app.get("/api/v1/status", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Attendance Management System",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/attendance", authMiddleware, attendanceRouter);
app.use("/api/v1/users", authMiddleware, authorizeRole("ADMIN"), userRouter);
app.use("/api/v1/report", authMiddleware, authorizeRole("ADMIN"), reportRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
