const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    avatar: { type: String },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    book_listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
