import { User } from "../models/user.model.js";

export class AuthServices {
  static async checkExistingUser(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  static async createUser(full_name, email, password) {
    const user = new User({ full_name, email, password });
    return await user.save();
  }

  static async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  static async getUserByID(id) {
    return await User.findById(id);
  }
}
