import { AttendanceService } from "../services/attendance.services.js";
import fastCsv from "fast-csv";

export class ReportController {
  static async dailyReport(req, res) {
    try {
      const { date } = req.query;
      const today = new Date().toISOString().split("T")[0];
      const attendance = await AttendanceService.getAttendanceByDate(
        date || today
      );

      return res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async monthlyReport(req, res) {
    try {
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required" });
      }

      const attendance = await AttendanceService.getAttendanceMonthly({
        year,
        month,
      });

      return res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async userReport(req, res) {
    try {
      const { userID, startDate, endDate } = req.query;
      if (!userID || !startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "User ID, start date, and end date are required" });
      }
      const records =
        await AttendanceService.getAttendanceRecordsByStartAndEndDate({
          userID,
          startDate,
          endDate,
        });

      return res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async dailyAbsenteeReport(req, res) {
    try {
      const { date } = req.query;
      if (!date)
        return res.status(400).json({ error: "Date is required (YYYY-MM-DD" });

      const absentees =
        await AttendanceService.getAttendanceRecordsByDateAndStatus({
          date,
          status: "ABSENT",
        });

      return res.status(200).json({
        success: true,
        absentCount: absentees.length,
        data: absentees,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async exportReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const records =
        await AttendanceService.getAttendanceRecordsByStartAndEndDate({
          startDate,
          endDate,
        });

      if (!records.length) {
        return res.status(404).json({ error: "No attendance records found." });
      }

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      const csvStream = fastCsv.format({ headers: true });

      csvStream.pipe(res).on("end", () => {
        console.log("CSV file successfully sent.");
      });

      records.forEach((record) => {
        csvStream.write({
          UserID: record.userID,
          Date: record.date.toISOString().split("T")[0],
          Status: record.status,
          CheckIn: record.checkIn || "N/A",
          CheckOut: record.checkOut || "N/A",
        });
      });

      csvStream.end();
    } catch (error) {
      console.error("Export Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Server Error" });
      }
    }
  }
}
