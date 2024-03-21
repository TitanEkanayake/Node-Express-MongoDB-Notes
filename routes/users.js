const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
// getting all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// getting one by ID
router.get("/:id", getuser, (req, res) => {
  res.json(res.user);
});

//creating one | Signup |
router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (password.length < 8) {
    res.json({
      status: 400,
      message: "Password must be at least 8 characters long",
    });
  } else {
    User.find({ email }).then((result) => {
      if (result.length > 0) {
        res.json({
          status: 400,
          message: "Your Email is already taken",
        });
      } else {
        const saltRounds = 10;
        bcrypt
          .hash(password, saltRounds)
          .then(async (hashedPassword) => {
            const user = new User({
              name: name,
              email: email,
              password: hashedPassword,
            });

            try {
              const newUser = await user.save();
              res.status(201).json(newUser);
            } catch (err) {
              res.status(400).json({ message: err.message });
            }
          })
          .catch((err) => {
            res.json({
              status: 400,
              message: `An error occurred while hashing your password - ${err.message}`,
            });
          });
      }
    });
  }
});

//Login
router.post("/login", (req, res) => {
  let { email, password } = req.body;
  // email = email.trim();
  // password = password.trim();

  User.find({ email })
    .then((data) => {
      if (data) {
        const hashedPassword = data[0].password;
        // res.send(hashedPassword);
        bcrypt
          .compare(password, hashedPassword)
          .then((result) => {
            if (result) {
              res.json({
                status: 200,
                message: "Login Successful !",
                user: data,
              });
            } else {
              res.json({
                status: 400,
                message: "Invalid Credentials ! ",
              });
            }
          })
          .catch((err) => {
            res.json({
              status: 400,
              message: `An error occurred while comparing your password - ${err.message}`,
            });
          });
      } else {
        res.json({
          status: 400,
          message: "Invalid Credentials !",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        message: `An error occurred while finding your Email - email not found`,
      });
    });
});
// updating one
router.patch("/:id", getuser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.description != null) {
    res.user.description = req.body.description;
  }
  try {
    const updateduser = await res.user.save();
    res.json(updateduser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// deleting one
router.delete("/:id", getuser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getuser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find the user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}
module.exports = router;
