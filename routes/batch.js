const express = require('express');
const router = express.Router();
const Batch = require('../models/batch')
const User = require('../models/user')

//Create batch
router.post("/", function (req, res, next) {
  const { batchName, stDate, endDate } = req.body;
  Batch.create({
    batchName,
    stDate,
    endDate,
    })
    .then((batch) => {
      User.findByIdAndUpdate(
        {_id: req.user._id},
        {$push: { batches: batch._id}},
        {new : true}
      )
      .populate({
        path: "batches",
        model: "Batch",
      })
      .exec((err, user) => {
        if(err) {
          console.log("err", )
          res.status(400).json({ message: "something  went wrong", error:  err});
        } else {
          res.status(200).json({ message: "Successfully created batch", batch, user });
        }
      })      
    })
    .catch((e) => {
      res.status(400).json({ message: "something  went wrong", error: e });
    });
});
// Delete Batch
router.delete("/:id", function (req, res) {
  Batch.findByIdAndRemove(
  { _id: req.params.id }
  )
  .then(() =>{
    res.status(200).json({message:"Successfully Deleted student"})
  })
  .catch((e) =>{
    res.status(400).json({message:"something went wrong" , error: e})
  })

});
//Get Batch details/ student overview
router.get("/:batchId", function(req, res , next){
  const { batchId } = req.params
  Batch.findById({_id: batchId})
  .populate({
    path: "students",
    model: "Student",   
  })
  .exec((err, batch) => {
    if(err) {
      res.status(400).json({ message: "something  went wrong", error: err });
    } else {
      res.status(200).json({batch})
    }
  })  
})

module.exports = router;