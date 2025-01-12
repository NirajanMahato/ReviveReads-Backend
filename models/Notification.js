const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    type: { type: String, required: true }, // e.g., "Book Approval", "Message"
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Read status
    createdAt: { type: Date, default: Date.now }, // Timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
