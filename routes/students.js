const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Batch = require('../models/batch');
let mongoose = require('mongoose');

//Create student
router.post('/', function (req, res) {
  const {name, imgUrl, batchId} = req.body;
  Student.create({
    name,
    imgUrl,
    batchId,
  })
    .then((studentRes) => {
      Batch.findByIdAndUpdate({_id: batchId}, {$push: {students: studentRes}})
        .then(() => {
          res
            .status(200)
            .json({
              message: 'Successfully created student',
              student: studentRes,
            });
        })
        .catch((e) =>
          res.status(400).json({message: 'something  went wrong', error: e})
        );
    })
    .catch((e) => {
      res.status(400).json({message: 'something  went wrong', error: e});
    });
});

//Get student details/ evaluation overview
router.get('/:studentId', function (req, res, next) {
  const {studentId} = req.params;
  Student.findById({_id: studentId})
    .populate({
      path: 'evaluations',
      model: 'Evaluation',
    })
    .exec((err, student) => {
      if (err) {
        res.status(400).json({message: 'something  went wrong', error: err});
      } else {
        res.status(200).json({student});
      }
    });
});

//Calculate percentages of green , yellow , red students in a class
router.get('/:batchId/percentage', function (req, res, next) {
  const { batchId } = req.params;
  Student
    .aggregate([
      {$match: { batchId: mongoose.Types.ObjectId(`${batchId}` )}},
      {$group: {_id: "$lstClrCode", count: { $sum: 1 } }}
    ])
    .then((result) => {
      console.log('aggregate',result)
      let redPercent = 0;
      let redCount = 0;
      let greenPercent = 0;
      let greenCount = 0;
      let yellowPercent = 0;
      let yellowCount = 0;

      const totalCount = result.reduce((accumulator, currentvalue) => {
        console.log("accumulator :", accumulator)
        console.log("currentvalue :", currentvalue)
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

      console.log("totalCount", totalCount) 

      redPercent = (redCount / totalCount) * 100;
      greenPercent = (greenCount / totalCount) * 100;
      yellowPercent = (yellowCount / totalCount) * 100;

      res.status(200).json([redPercent, greenPercent, yellowPercent]);
    })
    .catch((err) => next(err));
});

// Update Student
router.put('/:studentId', function (req, res) {
  Student.findByIdAndUpdate(
    {_id: req.params.studentId},
    {
      name: req.body.name,
      imgUrl: req.body.imgUrl,
    },
    {new: true}
  )
    .then((studentRes) => {
      res
        .status(200)
        .json({message: 'Successfully updated student', student: studentRes});
    })
    .catch((e) => {
      res.status(400).json({message: 'something went wrong', error: e});
    });
});
// Delete Student
router.delete('/:studentId', function (req, res) {
  Student.findByIdAndRemove({_id: req.params.studentId})
    .then(() => {
      res.status(200).json({message: 'Successfully Deleted student'});
    })
    .catch((e) => {
      res.status(400).json({message: 'something went wrong', error: e});
    });
});

module.exports = router;
