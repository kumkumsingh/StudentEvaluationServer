const express = require("express");
const router = express.Router();
const Evaluation = require("../models/evaluation");
const Student = require("../models/student")

//Update an evaluation for a student
router.put("/:evaluationId", function (req, res, next) {
    const evaluationId = req.params.evaluationId;
    const {studentId, clrCode, remarks } = req.body;    
    Evaluation.findByIdAndUpdate(
      { _id: evaluationId},
      {
        clrCode,
        remarks   
      },
      )
      .then((evaluation) => {
          Student.updateOne(
              { _id: studentId },
              { lstClrCode: clrCode }
            )
          .then(resp => {
            console.log("Response :",resp)
            res.status(200).json({ message: "Successfully updated  evaluation and student", evaluation });
            })
          .catch(e => console.log("error :",e))
        
      })
      .catch((e) => {
        res.status(400).json({ message: "something  went wrong", error: e });
      });
  });
 
  //Create evaluation for a student
router.post("/", function (req, res, next) {
  const { evalDate, clrCode, remarks , studentId} = req.body; 
  Evaluation.create({
    evalDate,
    studentId,
    clrCode,
    remarks,
    })
    .then((evaluationRes) => {
      Student.findByIdAndUpdate({_id: studentId}, {lstClrCode: clrCode, $push: { evaluations: evaluationRes}})
        .then(() => {
          res.status(200).json({ message: "Successfully created evaluation", evaluation: evaluationRes })
        })
        .catch((e) => res.status(400).json({ message: "something  went wrong", error: e }))
    })
    .catch((e) => {
      res.status(400).json({ message: "something  went wrong", error: e });
    });
});
 module.exports = router;