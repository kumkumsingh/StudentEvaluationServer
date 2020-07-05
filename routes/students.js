const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Batch = require('../models/batch');


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
    .then((student)=>{
      return Batch.findById({_id: student.batchId})
    })
    .then(batch =>{
      let students = batch.students.filter(student => (JSON.stringify(student) !== JSON.stringify(req.params.studentId)))
      Batch.findByIdAndUpdate({_id: batch._id}, {students: students},  {new: true} )
      .populate({
        path: 'students',
        model: 'Student',
      })
      .exec((err, updatedBatch) => {
        if (err) {
          res.status(400).json({message: 'something  went wrong', error: err});
        } else {
          res.status(200).json({message: 'Student successfully deleted', batch: updatedBatch});
        }
      });
    })
    .catch((e) => {
      res.status(400).json({message: 'something went wrong', error: e});
    });
});

module.exports = router;
