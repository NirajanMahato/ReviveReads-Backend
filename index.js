require("dotenv").config();
const express = require("express");
const {app, server} = require("./socket/socket");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./router/userRoutes");
const bookRoutes = require("./router/bookRoutes");
const messageRoutes = require("./router/messageRoutes");

connectDB();
const PORT = process.env.PORT ? process.env.PORT : 5000;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/product_images", express.static("product_images"));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
