const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Get users profile
router.get('/', function (req, res, next) {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(200).json({user});
    })
    .catch((e) => {
      res.status(400).json({message: 'user not found', error: e});
    });
});
// Update users profile
router.put('/', function (req, res, next) {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    {_id: userId},
    {
      userName: req.body.userName,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    {new: true}
  )
  .populate({
    path: 'batches',
    model: 'Batch',
  })
  .exec((err, updatedUser) => {
    let newUser = {
      userName: updatedUser.userName,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      batches: updatedUser.batches
    }
    if (err) {
      res
        .status(400)
        .json({message: 'user not updated', error: err});
    } else {
      res.status(200).json({
        message: 'User successfully updated',
        user: newUser
      })
    }
  })
})

// Update users profilePicture
router.put('/profilepicture', function (req, res, next) {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    {_id: userId},
    {
      profilePicture: req.body.profilePicture,
    },
    {new: true}
  )
  .populate({
    path: 'batches',
    model: 'Batch',
  })
  .exec((err, updatedUser) => {
    let newUser = {
      userName: updatedUser.userName,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      batches: updatedUser.batches
    }
    if (err) {
      res
        .status(400)
        .json({message: 'user not updated', error: err});
    } else {
      res.status(200).json({
        message: 'User successfully updated',
        user: newUser
      })
    }
  })
});

module.exports = router;
