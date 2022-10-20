const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const BankDetail = require("../models/bankdetail");
const checkAuth = require("../middleware/check-auth");




//get user profile for user 

router.get("/:userId/allbankdetails", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  BankDetail.find({ userId : req.params.userId})
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


// add new bank detail

router.post("/:userId/addbankdet",checkAuth, (req, res, next) => {
    const id = req.params.userId;
  
        const bankdetail = new BankDetail({
            _id: new mongoose.Types.ObjectId(),
            userId: id,
            accountNo: req.body.accountNo,
          });

          bankdetail
            .save()
            .then((result) => {
                if (req.userData.userId == id) {
              console.log(result);
              res.status(201).json({
                message: "Bank Detail Created",
                
              });
            }  else {
                    res.status(401).json({
                      message: "Auth failed (id differs from token)",
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


//update bank can be used for soft deleting 
router.patch("/:userId/:bankdetId/update", checkAuth,(req, res, next) => {
  const id = req.params.userId;
  
  BankDetail.updateMany({ _id: req.params.bankdetId,}, { $set: req.body })
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
