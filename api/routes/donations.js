const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Donation = require("../models/donation");
const checkAuth = require("../middleware/check-auth");

//view donation details
router.get("/:donationId", (req, res, next) => {
    const id = req.params.donationId;
    Donation.find({_id: id})
      .exec()
      .then((result) => {
        if (result) {
            console.log(result);
            res.status(200).json({ result });
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

//get donations by user id
router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    Donation.find({userid: id})
      .exec()
      .then((result) => {
        if (result) {
            console.log(result);
            res.status(200).json({ result });
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

  //get donations by fundraiser
  router.get("/:fundraiserId", (req, res, next) => {
    const id = req.params.fundraiserId;
    Donation.find({fundraiserid: id})
      .exec()
      .then((result) => {
        if (result) {
            console.log(result);
            res.status(200).json({ result });
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

  router.post("/:fundraiserId//addbankdet",checkAuth, (req, res, next) => {
    const id = req.params.fundraiserId;
        const donation = new Donation({
            _id: new mongoose.Types.ObjectId(),
            userid: req.userData.userId,
            fundraiserid: req.params.fundraiserId,
            detid:req.body.detid,
            amountdonated: req.body.amountdonated,
            anonymous: req.body.anonymous,
          });

          donation
            .save()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "Donation Created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
  
});

