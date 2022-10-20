const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");
const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:userId/profile", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        if (req.userData.userId == id) {
          console.log(result);
          res.status(200).json({ result });
        } else {
          res.status(401).json({
            message: "Auth failed (id differs from token)",
          });
        }
      } else {
        res.status(404).json({
          message: "Invalid ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/signup", (req, res, next) => {
  User.find({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            messgae: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "" + process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            messgae: "Auth successful",
            token: token,
          });
        } else {
          res.status(401).json({
            messgae: "Auth failed",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// router.get("/:userId", (req, res, next) => {
//   const id = req.params.userId;
//   User.findById(id)
//     .exec()
//     .then((doc) => {
//       console.log("From Database", doc);
//       if (doc) {
//         res.status(200).json({ doc });
//       } else {
//         res
//           .status(404)
//           .json({ message: "No valid entry found for provided ID" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(200).json({ error: err });
//     });
// });

// router.patch("/:userId", (req, res, next) => {
//   const id = req.params.userId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   User.update({ _id: id }, { $set: { updateOps } })
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(500).json({
//         result,
//       });
//     })
//     .catch((err) => {
//       console.log(result);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// router.delete("/:userId", (req, res, next) => {
//   const id = req.params.userId;
//   User.remove({
//     _id: id,
//   })
//     .exec()
//     .then((result) => {
//       res.status(200).json(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });
module.exports = router;