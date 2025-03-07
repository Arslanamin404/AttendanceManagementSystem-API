import { AttendanceService } from "../services/attendance.services.js";
import { AuthServices } from "../services/auth.services.js";
import { generateToken } from "../utils/generateToken.js";

export class AuthController {
  static async register(req, res) {
    try {
      const { full_name, email, password } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existing_user = await AuthServices.checkExistingUser(email);
      if (existing_user) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      await AuthServices.createUser(full_name, email, password);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await AuthServices.getUserByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      // generate token
      const token = generateToken({ id: user._id, role: user.role });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, //true for production
        sameSite: "strict",
      });

      return res.status(200).json({
        success: true,
        message: "Logged In successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false, //true for production
        sameSite: "strict",
      });

      return res.status(200).json({
        success: true,
        message: "Logged Out successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      const attendanceRecords =
        await AttendanceService.getAttendanceRecordsByStatus({
          userID: user.id,
          status: "PRESENT",
        });

      const presentDates = attendanceRecords.map(
        (record) => record.date.toISOString().split("T")[0]
      );

      return res.status(200).json({
        success: true,
        profile: {
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          attendance: presentDates,
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
