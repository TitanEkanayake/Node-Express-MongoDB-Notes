require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const cors = require("cors");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(express.json());
// app.use(cors());

const notesRouter = require("./routes/notes");
const usersRouter = require("./routes/users");

app.use("/notes", notesRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server Started on port 8080"));
