import { AttendanceService } from "../services/attendance.services.js";

export class AttendanceController {
  static CHECK_IN_DEADLINE = 10; // 10:00 AM
  static CHECK_OUT_ALLOWED_TIME = 14; // 2:00 PM

  static async checkIn(req, res) {
    try {
      const userID = req.user.id;
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentHour = now.getHours();

      if (currentHour >= AttendanceController.CHECK_IN_DEADLINE) {
        return res.status(400).json({
          success: false,
          message: "Check-in is only allowed before 10:00 AM",
        });
      }

      let attendance = await AttendanceService.getAttendanceByIdAndDate({
        userID,
        date: today,
      });

      if (attendance && attendance.status === "ABSENT") {
        return res.status(400).json({
          success: false,
          message:
            "You have been marked absent today. Check-in is not allowed.",
        });
      }

      if (attendance) {
        return res.status(400).json({
          success: false,
          message: "Already checked in today",
        });
      }

      attendance = await AttendanceService.createAttendance({
        userID,
        date: today,
        status: "PRESENT",
        checkIn: now,
      });

      return res.status(201).json({
        success: true,
        message: "Check-in successful",
        data: attendance,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async checkOut(req, res) {
    try {
      const userID = req.user.id;
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentHour = now.getHours();

      let attendance = await AttendanceService.getAttendanceByIdAndDate({
        userID,
        date: today,
      });

      if (!attendance) {
        return res.status(400).json({
          success: false,
          message: "You must check-in first!",
        });
      }

      if (currentHour < AttendanceController.CHECK_OUT_ALLOWED_TIME) {
        return res.status(400).json({
          success: false,
          message: "Check-out is only allowed after 2:00 PM",
        });
      }

      if (attendance.checkOut) {
        return res.status(400).json({
          success: false,
          message: "Already checked out!",
        });
      }

      attendance.checkOut = now;
      await attendance.save();

      return res.status(201).json({
        success: true,
        message: "Check-out successful",
        data: attendance,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getAttendanceReport(req, res) {
    try {
      const { startDate, endDate } = req.body;
      const userID = req.user.id;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid startDate & endDate (YYYY-MM-DD)",
        });
      }

      const records =
        await AttendanceService.getAttendanceRecordsByIdStartAndEndDate({
          userID,
          startDate,
          endDate,
        });

      let presentCount = 0;
      let absentCount = 0;
      let lateCheckInCount = 0;
      let earlyCheckOutCount = 0;

      records.forEach((record) => {
        if (record.status === "PRESENT") {
          presentCount++;

          const checkInThreshold = new Date(record.date);
          checkInThreshold.setHours(9, 0, 0, 0); // 9:0 AM

          const checkOutThreshold = new Date(record.date);
          checkOutThreshold.setHours(15, 30, 0, 0); // 3:30 PM

          // Check if the user was late
          if (record.checkIn && new Date(record.checkIn) > checkInThreshold) {
            lateCheckInCount++;
          }

          // Check if the user left early
          if (
            record.checkOut &&
            new Date(record.checkOut) < checkOutThreshold
          ) {
            earlyCheckOutCount++;
          }
        } else {
          absentCount++;
        }
      });

      return res.status(200).json({
        success: true,
        records,
        summary: {
          presentCount,
          absentCount,
          lateCheckInCount,
          earlyCheckOutCount,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
