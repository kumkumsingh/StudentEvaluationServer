const passport = require('passport');
const User = require('../models/user');

//SerializeUser informs passport strategy what to be stored in session.
//It is called when you are logging In
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

//DeserializeUser fetches the User information based on userIdFromSession.
//User information fetched from User collection is stored in req.user
//For the rest of the path apart from login it deserializes.
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .populate({
      path: "batches",
      model: "Batch",
    })
    .exec((err, userDocument) => {
      if(err) {
        console.log("err", err)
        cb(err);
      } else {
        cb(null, userDocument)
      }
    });
});