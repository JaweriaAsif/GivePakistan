const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Fundraiser = require("../models/fundraiser");
const checkAuth = require("../middleware/check-auth");

//get all fundraisers
router.get("/", (req, res, next) => {
    Fundraiser.find()
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

//get details of one fundraiser
  router.get("/:fundraiserId", (req, res, next) => {
    const id = req.params.fundraiserId;
    Fundraiser.find({_id: id})
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

  //get fundraisers by user  
  router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    Fundraiser.find({starteruser: id})
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
  
  
  //get fundraisers by company  
  router.get("/:companyId", (req, res, next) => {
    const companyId = req.params.companyId;
    Fundraiser.find({companyid: companyId})
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
  
  //get fundraisers by category 
  router.get("/:category", (req, res, next) => {
    const cat = req.params.category;
    Fundraiser.find({category: cat})
      .exec()
      .then((result) => {
        if (result) {
            console.log(result);
            res.status(200).json({ result });
        } else {
          res.status(404).json({
            message: "Invalid request",
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

  //Update fundraiser
  router.patch("/:fundraiserId/update", checkAuth,(req, res, next) => {
    const id = req.params.fundraiserId;
    
    Fundraiser.updateMany({ _id: id }, { $set: req.body })
      .exec()
      .then((result) => {
        if (req.userData.userId == starteruser) {
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

//create fundraiser
  router.post("/newfundraiser", checkAuth,(req, res, next) => {
              const fundraiser = new Fundraiser({
                _id: new mongoose.Types.ObjectId(),
                name:  req.body.name,
                description:   req.body.description,
                goal:  req.body.goal,
                duedate:  req.body.duedate, 
                category:  req.body.category,
                amountdonated:  req.body.amountdonated,
                amountcollected:  req.body.amountcollected,
                //approved:  req.body.name,
                //active:  req.body.name,
                starteruser: req.userData.userId, //user
                //companyid:  req.userData.companyId, //company
                //approvedby:  req.body.name,
              });
  
              fundraiser
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    message: "Fundraiser Created",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          );
 module.exports = router;
       