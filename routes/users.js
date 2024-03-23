const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const generateResetToken = require("../utils/tokengenerator");
const sendResetPasswordEmail = require("../utils/emailgenerator");

// getting all

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      status: 200,
      users: users,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
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
              res.json({
                status: 201,
                message: "User Created",
                user: newUser,
              });
            } catch (err) {
              res.json({
                status: 400,
                message: err.message,
              });
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
  email = email.trim();
  password = password.trim();

  User.find({ email })
    .then((data) => {
      if (data) {
        const hashedPassword = data[0].password;
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
    .catch(() => {
      res.json({
        status: 400,
        message: `An error occurred cannot find the user please signup!`,
      });
    });
});

//forget password

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const resetToken = generateResetToken();

  try {
    if (!resetToken) {
      return res.json({
        status: 404,
        message: "Failed to generate reset token.",
      });
    }

    const expirationTime = Date.now() + 3600000;

    const user = await User.findOneAndUpdate(
      { email },
      { resetToken: resetToken, resetTokenExpiration: expirationTime }, // Set expiration to 1 hour
      { new: true }
    );
    console.log(user);

    if (!user) {
      return res.json({ status: 404, message: "User not found." });
    }

    // Await the email sending process
    await sendResetPasswordEmail(user.email, resetToken);
    res.json({ status: 200, message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.json({ status: 500, message: "Internal server error." });
  }
});

// Route for handling password reset

router.post("/reset-password", (req, res) => {
  const { email, token, newPassword } = req.body;
  // Validate token and update password
  User.findOneAndUpdate(
    { email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
    {
      password: bcrypt.hashSync(newPassword, 10),
      resetToken: "",
      resetTokenExpiration: null,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.json({ status: 404, message: "Invalid or expired token." });
      }
      res.json({ status: 200, message: "Password updated successfully." });
    })
    .catch((err) => {
      console.error(err);
      res.json({ status: 500, message: "Internal server error." });
    });
});

// updating one

router.patch("/:id", getuser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  try {
    const updateduser = await res.user.save();
    res.json({
      status: 200,
      user: updateduser,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: err.message,
    });
  }
});

// deleting one

router.delete("/:id", getuser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({
      status: 200,
      message: "User Deleted",
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
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
