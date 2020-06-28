const express = require("express");
const router = express.Router();
const Evaluation = require("../models/evaluation");
const Student = require("../models/student")

//Get all evaluations
router.get("/", function(req, res , next){
    Evaluation.find()
    .then((evaluations) =>{
      res.status(200).json({evaluations})
    })
    .catch((e) =>{
      res.status(400).json({ message: "something  went wrong", error: e });
    })
  })
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
  const studentId = req.params.id;
  const { evalDate, clrCode, remarks } = req.body; 
  Evaluation.create({
    evalDate,
    studentId,
    clrCode,
    remarks,
    })
    .then((evaluation) => {
      Student.updateOne({_id: studentId},
      {lstClrCode:clrCode}
      )
      .then(resp => {
        console.log("Response :",resp)
        res.status(200).json({ message: "Successfully evaluated student", evaluation:evaluation });
      })
      .catch(e => console.log("error :",e))
      
    })
    .catch((e) => {
      res.status(400).json({ message: "something  went wrong", error: e });
    });
});
 module.exports = router;