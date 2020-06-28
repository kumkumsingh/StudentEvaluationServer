const express = require("express");
const router = express.Router();
const upload = require('../services/aws-upload');
const profileUpload = upload.single('profilePicture');

router.post('/profilepicture', function (req, res) {
    console.log('profile picture upload')
    // console.log(req)
    profileUpload(req, res, function (err) {
        // console.log(req)
        if (err) {
            return res.status(400).json({ message: err })
        }
        return res.status(200).json({ 'profilePicture': req.file.location });
    });
});


module.exports = router;