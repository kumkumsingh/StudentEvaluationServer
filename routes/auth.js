const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport');
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

//Route for signing up
router.post('/signup', function(req, res, next) {

  const { userName, email, password } = req.body

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    userName,
    email,
    password: hashPass
  })
  .then(() => {
    res.status(200).json({ message: "Successfully signed up"})
  })
  .catch((e) => {
    res.status(400).json({ message: "something  went wrong", error: e})
  })
});

router.post('/login', function(req, res, next) {
  //authenticate based on local strategy
   passport.authenticate("local", (err, user, info) => {
     if (err) { return next(err); }
     // console.log("user", user)
     if (!user) { return res.status(401).json({message: 'user not authenticated'}); }
     req.logIn(user, function(err) {
       if (err) { return next(err); }
       //new user is created inorder to avoid password to be sent in the frontend 
       let newUser = {
         userName: req.user.userName,
         firstName: req.user.firstName,
         lastName: req.user.lastName,
         email: req.user.email,
         profilePicture: req.user.profilePicture,
       }
       return res.status(200).json(newUser);
     });
   })(req, res, next)
 });
//req.isAuthenticated checks whether the user is logged in 
 router.get('/isLoggedIn', function(req, res, next) {
  if(req.isAuthenticated()) {
    let newUser = {
      email: req.user.email,
      userName: req.user.userName,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profilePicture: req.user.profilePicture,
      batches: req.user.batches
    }
    // console.log("batches :", newUser.batches)
    res.status(200).json(newUser)
    return
  }
  res.status(403).json({message: 'please authenticate'})
});
//Logout router
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Successfully logged out" });
}); 
module.exports = router;
