const express = require('express');
const router = express.Router();
const Batch = require('../models/batch');
const Student = require('../models/student');
const User = require('../models/user');
let mongoose = require('mongoose');

const calculatePercentage = (batchId) => {
  console.log('batchId', batchId);
  let greenCount = 0;
  let yellowPercent = 0;
  let yellowCount = 0;
  let redPercent = 0;
  let redCount = 0;
  let greenPercent = 0;

  return Student.aggregate([
    {$match: {batchId: mongoose.Types.ObjectId(batchId)}},
    {$group: {_id: '$lstClrCode', count: {$sum: 1}}},
  ]).then((result) => {
    console.log('result', result);
    let totalCount = 0;
    totalCount = result.reduce((accumulator, currentvalue) => {
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

    console.log('red, green, yellow', redPercent, greenPercent, yellowPercent);
    return {
      message: 'success',
      percentage: [
        {Red: redPercent},
        {Green: greenPercent},
        {Yellow: yellowPercent},
      ],
      count: {redCount, greenCount, yellowCount},
    };
  });
};

const findRandomColor = (count) => {
  let colorFound = false;
  let randomColor;
  do {
    let randomNum = parseInt(Math.random() * 100);
    switch (true) {
      case randomNum > 0 && randomNum <= 50 && count.redCount > 0:
        randomColor = 'Red';
        colorFound = true;
        break;
      case randomNum >= 51 && randomNum <= 83 && count.yellowCount > 0:
        randomColor = 'Yellow';
        colorFound = true;
        break;
      case randomNum >= 84 && randomNum <= 100 && count.greenCount > 0:
        randomColor = 'Green';
        colorFound = true;
        break;
      case count.redCount === 0 &&
        count.greenCount === 0 &&
        count.yellowCount === 0:
        randomColor = '';
        colorFound = true;
      default:
        break;
    }
  } while (!colorFound);
  return randomColor;
};

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
router.delete('/:batchId', function (req, res) {
  console.log('batchId', req.params.batchId);
  let batches;
  Batch.findByIdAndRemove({_id: req.params.batchId})
    .then(() => {
      return User.findById({_id: req.user._id});
    })
    .then((user) => {
      batches = user.batches.filter(
        (batch) => JSON.stringify(batch) !== JSON.stringify(req.params.batchId)
      );
      User.findByIdAndUpdate(
        {_id: req.user._id},
        {batches: batches},
        {upsert: true}
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
              .json({
                message: 'Batch deleted successfully',
                batches: user.batches,
              });
          }
        });
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
  calculatePercentage(batchId)
    .then((resp) => res.status(200).json(resp.percentage))
    .catch((err) =>
      res.status(400).json({message: 'Something went wrong', err: err})
    );
});

//to get random record based on algorithm
router.get('/:batchId/random', function (req, res, next) {
  const {batchId} = req.params;
  calculatePercentage(batchId)
    .then((resp) => {
      console.log('resp', resp);
      const randomColor = findRandomColor(resp.count);
      if (randomColor === '') {
        return null;
      } else {
        return Student.find({
          lstClrCode: randomColor,
          batchId: mongoose.Types.ObjectId(batchId),
        });
      }
    })
    .then((students) => {
      if (students) {
        const randomIndex = parseInt(Math.random() * students.length);
        res.status(200).json({randomStudent: students[randomIndex]});
      } else {
        res.status(200).json({randomStudent: null});
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
