import { Attendance } from "../models/attendance.model.js";

export class AttendanceService {
  static async getAttendanceByIdAndDate({ userID, date }) {
    return await Attendance.findOne({ userID, date });
  }

  static async getAttendanceByDate(date) {
    return await Attendance.find({ date }).populate(
      "userID",
      "full_name email"
    );
  }

  static async createAttendance({ userID, date, status, checkIn }) {
    const data = { userID, date, status };

    if (checkIn) {
      data.checkIn = checkIn;
    }

    return await Attendance.create(data);
  }

  static async getAttendanceRecordsByIdStartAndEndDate({
    userID,
    startDate,
    endDate,
  }) {
    const records = await Attendance.find({
      userID,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("userID", "full_name email");

    return records;
  }

  static async getAttendanceRecordsByStartAndEndDate({ startDate, endDate }) {
    const records = await Attendance.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    // .populate("userID", "full_name email");

    return records;
  }

  static async getAttendanceRecordsByStatus({ userID, status }) {
    const records = await Attendance.find({
      userID,
      status,
    });

    return records;
  }

  static async getAttendanceRecordsByDateAndStatus({ date, status }) {
    const records = await Attendance.find({
      date,
      status,
    });

    return records;
  }

  static async getAttendanceMonthly({ year, month }) {
    const records = await Attendance.find({
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    });

    return records;
  }
}
