const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const Company = require("../models/company");
const checkAuth = require("../middleware/check-auth");

//get all companies for admin only

router.get("/allcompanies", (req, res, next) => {
  Company.find()
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


// get company details

router.get("/:companyId/profile", checkAuth, (req, res, next) => {
  const id = req.params.companyId;
  Company.findById(id)
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


// Company user signup 

router.post("/companysignup", (req, res, next) => {
  Company.find({
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
            const company = new Company({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
              phoneNo: req.body.phoneNo,
            });

            company
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "Company Created",
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


//login access token
router.post("/login", (req, res, next) => {
  Company.find({ email: req.body.email })
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


//update company can be used for edit profile or approval of admin can also be used for soft delete
router.patch("/:companyId/update", checkAuth,(req, res, next) => {
  const id = req.params.userId;
  
  Company.updateMany({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      if (req.userData.userId == id) {
      console.log(result);
      res.status(500).json({
        result,
      });
    } else {
      res.status(401).json({
        message: "Auth failed (id differs from token)",
      });
    }
    })
    .catch((err) => {
      console.log(result);
      res.status(500).json({
        error: err,
      });
    });
});


module.exports = router;
