const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Evaluation = require("../models/evaluation");

//Create student
router.post("/", function (req, res) {
  const { name, lstClrCode, imgUrl } = req.body;
  Student.create({
    name,
    lstClrCode,
    imgUrl,
  })
    .then((studentRes) => {
      res.status(200).json({ message: "Successfully created student", student: studentRes });
    })
    .catch((e) => {
      res.status(400).json({ message: "something  went wrong", error: e });
    });
});
// Update Student
router.put("/:id", function (req, res) {
  Student.findByIdAndUpdate(
  { _id: req.params.id },
  {
    name:req.body.name,
    imgUrl:req.body.imgUrl
  }
  ,
  {new: true}
  )
  .then((studentRes) =>{
    res.status(200).json({message:"Successfully updated student" , student: studentRes})
  })
  .catch((e) =>{
    res.status(400).json({message:"something went wrong" , error: e})
  })

});
// Delete Student
router.delete("/:id", function (req, res) {
  Student.findByIdAndRemove(
  { _id: req.params.id }
  )
  .then(() =>{
    res.status(200).json({message:"Successfully Deleted student"})
  })
  .catch((e) =>{
    res.status(400).json({message:"something went wrong" , error: e})
  })

});
//Get all students
router.get("/", function(req, res , next){
  Student.find()
  .then((students) =>{
    res.status(200).json({students})
  })
  .catch((e) =>{
    res.status(400).json({ message: "something  went wrong", error: e });
  })
})

module.exports = router;
