const Book = require("../models/Book");
const User = require("../models/User");

const adminSummary = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Count new users within the last 7 days
    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Count new books within the last 7 days
    const newBooksCount = await Book.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Count total books listed
    const totalBooksCount = await Book.countDocuments();

    // Count total books listed
    const booksPending = await Book.countDocuments({ status: "Pending" });

    res.status(200).json({
      newUsersCount,
      newBooksCount,
      totalBooksCount,
      booksPending,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminSummary };
