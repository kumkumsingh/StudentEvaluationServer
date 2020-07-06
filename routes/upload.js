const express = require("express");
const router = express.Router();
const upload = require('../services/aws-upload');
const profileUpload = upload.single('profilePicture');

router.post('/profilepicture', function (req, res) {
    profileUpload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err })
        }
        return res.status(200).json({ 'profilePicture': req.file.location });
    });
});


module.exports = router;