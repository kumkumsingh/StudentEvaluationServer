const express = require('express');
const router = express.Router();
const Batch = require('../models/batch');
const Student = require('../models/student');
const User = require('../models/user');
let mongoose = require('mongoose');

//Create batch
router.post('/', function (req, res, next) {
  const {batchName, stDate, endDate} = req.body;
  Batch.create({
    batchName,
    stDate,
    endDate,
  })
    .then((batch) => {
      User.findByIdAndUpdate(
        {_id: req.user._id},
        {$push: {batches: batch._id}},
        {new: true}
      )
        .populate({
          path: 'batches',
          model: 'Batch',
        })
        .exec((err, user) => {
          if (err) {
            console.log('err');
            res
              .status(400)
              .json({message: 'something  went wrong', error: err});
          } else {
            res
              .status(200)
              .json({message: 'Successfully created batch', batch, user});
          }
        });
    })
    .catch((e) => {
      res.status(400).json({message: 'something  went wrong', error: e});
    });
});
// Delete Batch
router.delete('/:id', function (req, res) {
  Batch.findByIdAndRemove({_id: req.params.id})
    .then(() => {
      res.status(200).json({message: 'Successfully Deleted student'});
    })
    .catch((e) => {
      res.status(400).json({message: 'something went wrong', error: e});
    });
});
//Get Batch details/ student overview
router.get('/:batchId', function (req, res, next) {
  const {batchId} = req.params;
  Batch.findById({_id: batchId})
    .populate({
      path: 'students',
      model: 'Student',
    })
    .exec((err, batch) => {
      if (err) {
        res.status(400).json({message: 'something  went wrong', error: err});
      } else {
        res.status(200).json({batch});
      }
    });
});

//Calculate percentages of green , yellow , red students in a class
router.get('/:batchId/percentage', function (req, res, next) {
  const {batchId} = req.params;
  Student.aggregate([
    {$match: {batchId: mongoose.Types.ObjectId(batchId)}},
    {$group: {_id: '$lstClrCode', count: {$sum: 1}}},
  ])
    .then((result) => {
      console.log('aggregate', result);
      let redPercent = 0;
      let redCount = 0;
      let greenPercent = 0;
      let greenCount = 0;
      let yellowPercent = 0;
      let yellowCount = 0;

      const totalCount = result.reduce((accumulator, currentvalue) => {
        switch (currentvalue._id) {
          case 'Red':
            redCount = parseInt(currentvalue.count);
            break;
          case 'Green':
            greenCount = parseInt(currentvalue.count);
            break;
          case 'Yellow':
            yellowCount = parseInt(currentvalue.count);
            break;
          default:
            break;
        }
        return accumulator + parseInt(currentvalue.count);
      }, 0);
      redPercent = (redCount / totalCount) * 100;
      greenPercent = (greenCount / totalCount) * 100;
      yellowPercent = (yellowCount / totalCount) * 100;

      res.status(200).json(
        ([
          {'Red': redPercent},
          {'Green': greenPercent},
          {'Yellow': yellowPercent},
        ])
      );
    })
    .catch((err) => next(err));
});
//to get random record based on algorithm
router.get('/:batchId/random', function (req, res, next) {
  const {batchId} = req.params;
  Student.aggregate([
    {$match: {batchId: mongoose.Types.ObjectId(batchId)}},
    {$group: {_id: '$lstClrCode', count: {$sum: 1}}},
  ])
    .then((result) => {
      let redPercent = 0;
      let redCount = 0;
      let greenPercent = 0;
      let greenCount = 0;
      let yellowPercent = 0;
      let yellowCount = 0;

      const totalCount = result.reduce((accumulator, currentvalue) => {
        switch (currentvalue._id) {
          case 'Red':
            redCount = parseInt(currentvalue.count);
            break;
          case 'Green':
            greenCount = parseInt(currentvalue.count);
            break;
          case 'Yellow':
            yellowCount = parseInt(currentvalue.count);
            break;
          default:
            break;
        }
        return accumulator + parseInt(currentvalue.count);
      }, 0);
      redPercent = (redCount / totalCount) * 100;
      greenPercent = (greenCount / totalCount) * 100;
      yellowPercent = (yellowCount / totalCount) * 100;
      let colorFound = false;
      do {
        let randomNum = parseInt(Math.random() * 100);
        switch (true) {
          case randomNum > 0 && randomNum <= 50 && redCount > 0:
            randomCol = 'Red';
            colorFound = true;
            break;
          case randomNum >= 51 && randomNum <= 83 && yellowCount > 0:
            randomCol = 'Yellow';
            colorFound = true;
            break;
          case randomNum >= 84 && randomNum <= 100 && greenCount > 0:
            randomCol = 'Green';
            colorFound = true;
            break;
          default:
            break;
        }
      } while (!colorFound);
      return Student.find(
        { lstClrCode: randomCol, batchId: mongoose.Types.ObjectId(batchId) }
      )
    })
    .then(students=>{
      const randomIndex = parseInt(Math.random() * students.length);
      res.status(200).json({randomStudent: students[randomIndex]})
    })
    .catch((err) => next(err));
});

module.exports = router;
