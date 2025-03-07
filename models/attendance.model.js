import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      default: "ABSENT",
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.checkIn || (value && value > this.checkIn);
        },
        message: "Check-out must be after check-in.",
      },
    },
  },
  { timestamps: true }
);

// It ensures that each user can have only one attendance record per day and prevents duplicate entries for the same user on the same date
attendanceSchema.index({ userID: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
