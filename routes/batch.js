const express = require('express');
const router = express.Router();
const Batch = require('../models/batch')

//Create batch
router.post("/", function (req, res, next) {
  const { batchName, stDate, endDate } = req.body;
  Batch.create({
    batchName,
    stDate,
    endDate,
    })
    .then((batch) => {
      res.status(200).json({ message: "Successfully created batch", batch:batch });
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
//Get Batch details
router.get("/", function(req, res , next){
  Batch.find()
  .then((batches) =>{
    res.status(200).json({batches})
  })
  .catch((e) =>{
    res.status(400).json({ message: "something  went wrong", error: e });
  })
})


module.exports = router;