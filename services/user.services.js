import { User } from "../models/user.model.js";

export class UserService {
  static async getAllUsers() {
    return await User.find().select("-password");
  }
  static async getUserById(id) {
    return await User.findById(id).select("-password");
  }
  static async updateUser(id, { full_name, email, role, status }) {
    return await User.findByIdAndUpdate(id, { full_name, email, role, status });
  }
  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}
