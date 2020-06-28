const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Get users profile
router.get("/", function (req, res, next) {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((e) => {
      res.status(400).json({ message: "user not found", error: e });
    });
});
// Update users profile
router.put("/", function (req, res, next) {
  console.log("req.body.userName :", req.body.userName)
  const userId = req.user._id;
  User.findByIdAndUpdate(
    {_id: userId},
    {
      userName: req.body.userName,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    {new: true}
  )
  .then((profileResp) => {
    console.log("profileResp :", profileResp)
    res.status(200).json({user: profileResp})
    return
  })
  .catch((e) => {
    res.status(400).json({ message: "user not updated", error: e })
  })
});

// Update users profilePicture
router.put("/profilepicture", function (req, res, next) {
  console.log("body.profilepicture : ", req.body.profilePicture)
  const userId = req.user._id;
  console.log("userId :", userId)
  User.findByIdAndUpdate(
    {_id: userId},
    {
      profilePicture: req.body.profilePicture
    },
    {new: true}
  )
  .then((profileResp) => {
    console.log("profileResp",profileResp)
    res.status(200).json({user: profileResp})
    return
  })
  .catch((e) => {
    res.status(400).json({ message: "user not updated", error: e })
  })
});


module.exports = router;
