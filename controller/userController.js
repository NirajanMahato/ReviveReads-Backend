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
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Sign-In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const token = jwt.sign(
        { email: existingUser.email, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
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
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

module.exports = { getAllUsers, signUp, signIn };
