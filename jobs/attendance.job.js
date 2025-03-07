import cron from "node-cron";
import { UserService } from "../services/user.services.js";
import { AttendanceService } from "../services/attendance.services.js";

// running every day at 3:30 pm
// "minute(0-59) hour(0-23) dayOfMonth(1-31) Month(1-12) dayOfWeek(1-7)"
cron.schedule("9 16 * * *", async () => {
  console.log(
    "running every day at midnight to check how many were absent today"
  );

  const today = new Date().toISOString().split("T")[0];
  const users = await UserService.getAllUsers();

  for (const user of users) {
    const attendance = await AttendanceService.getAttendanceByIdAndDate({
      userID: user._id,
      date: today,
    });

    if (!attendance) {
      await AttendanceService.createAttendance({
        userID: user._id,
        date: today,
        status: "ABSENT",
      });

      console.log(`📌 Marked Absent: ${user.full_name} (${today})`);
    }
  }
  console.log("✅ Daily Absentee Check Completed.");
});
