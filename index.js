require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./router/userRoutes");

connectDB();
const PORT = process.env.PORT ? process.env.PORT : 5000;

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
