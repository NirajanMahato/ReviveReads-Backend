const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//Get all users information
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(404).json({ message: "User not found" }, error);
  }
};

// Sign-Up
const signUp = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    //Check if email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists " });
    }

    //check password's length
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 5" });
    }
    //Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      address,
    });

    const data = await newUser.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "nirajanmahato44@gmail.com",
        pass: "eyrnqzsnphxlkyhq",
      },
    });

    const info = await transporter.sendMail({
      from: "nirajanmahato44@gmail.com",
      to: email,
      subject: "Welcome to ReviveReads",
      html: `
        <h1>Your Registration has been completed</h1>
        <p>Your user id is ${newUser.id}</p>
        `,
    });

    res.status(201).json({ message: "User saved successfully", data, info });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Sign-In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: existingUser._id,
          role: existingUser.role,
          token,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

//Get user's information
const getUserById = async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.headers;
    const { name, phone, address } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (req.file) updateFields.avatar = req.file.originalname;

    const data = await User.findByIdAndUpdate(id, updateFields, { new: true }); // { new: true }: Returns the updated document.

    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findByIdAndDelete(id);
    if (data == null) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addBookToFavorites = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
      return res.status(200).json({ message: "Book added to favorites", user });
    } else {
      return res.status(400).json({ message: "Book already in favorites" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const removeBookFromFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (user.favorites.includes(bookId)) {
      user.favorites = user.favorites.filter((id) => id.toString() !== bookId); // Remove book
      await user.save();
      return res
        .status(200)
        .json({ message: "Book removed from favorites", user });
    } else {
      return res.status(400).json({ message: "Book not found in favorites" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getFavouriteBook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

//
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filterdUsers = await User.find({
      _id: { $ne: loggedInUserId },
      role: { $ne: "admin" },
    }).select("-password");

    res.status(200).json(filterdUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  signUp,
  signIn,
  getUserById,
  deleteById,
  updateData,
  addBookToFavorites,
  removeBookFromFavorites,
  getFavouriteBook,
  getUsersForSidebar,
};
