const passport = require('passport');
const User = require('../models/user');

//SerializeUser informs passport strategy what to be stored in session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

//DeserializeUser fetches the User information based on userIdFromSession.
//User information fetched from User collection is stored in req.user
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
  .then(userDocument => {
    cb(null, userDocument);
  })
  .catch(err => {
    cb(err);
  })
});