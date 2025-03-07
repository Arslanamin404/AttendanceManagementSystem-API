import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.post("/check-in", AttendanceController.checkIn);
attendanceRouter.post("/check-out", AttendanceController.checkOut);
attendanceRouter.get("/report", AttendanceController.getAttendanceReport);

export default attendanceRouter;
