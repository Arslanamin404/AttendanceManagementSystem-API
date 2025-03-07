import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.get("/daily", ReportController.dailyReport);
reportRouter.get("/monthly", ReportController.monthlyReport);
reportRouter.get("/user-report", ReportController.userReport);
reportRouter.get("/daily-absentees", ReportController.dailyAbsenteeReport);
reportRouter.get("/export", ReportController.exportReport);

export default reportRouter;
