const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// to access the environment variables
require('dotenv').config();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-west-2'
})

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if ((file.mimetype === 'image/jpeg')  ||  
        (file.mimetype === 'image/png')) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

// multer will help us to store the files in the local public or in the s3 
const upload = multer({
    limits: {
        //Here we can set the maximum file size
        fileSize: 5 * 1024 * 1024  // X MB
    },
    storage: multerS3({
        s3: s3,
        fileFilter: fileFilter,
        bucket: process.env.BUCKET_NAME,
        // acl: this needs to be configured so that the uploaded file will be publicly accessible
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_META-DATA' });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload;