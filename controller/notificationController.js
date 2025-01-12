const Notification = require("../models/Notification");

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 notifications

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Create a notification
const createNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({ user: userId, type, message });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return null;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};
