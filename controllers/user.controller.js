import { UserService } from "../services/user.services.js";

export class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const userID = req.params.id;
      const user = await UserService.getUserById(userID);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const userID = req.params.id;
      const { full_name, email, role, status } = req.body;

      const user = await UserService.updateUser(userID, {
        full_name,
        email,
        role,
        status,
      });
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userID = req.params.id;

      await UserService.deleteUser(userID);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
