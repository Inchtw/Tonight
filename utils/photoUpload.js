const s3 = require('./s3');
require('dotenv').config();
const { AWS_BUCKET } = process.env;
const multer = require('multer');
const multerS3 = require('multer-s3');


var imageupload = multer({
    storage: multerS3({
        s3: s3,
        bucket: AWS_BUCKET,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const {name} = req.body;
            const fileExtension = file.mimetype.split('/')[1];
            cb(null,'User/Cockctails/' + Date.now()+'/' +name  +'.'+fileExtension);
        },
    })
});


module.exports = imageupload;