const s3 = require('./s3');
require('dotenv').config();
const {AWS_BUCKET} = process.env;
const multer = require('multer');
const multerS3 = require('multer-s3');

const imageupload = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb) {
      // User/Cocktails/${id}/Date.now()+'/' +name  +'.'+fileExtension);
      try {
        const userId = req.id;
        const {name} = req.body;
        if (!req.id) {
          throw new Error('no id!');
        }
        const fileExtension = file.mimetype.split('/')[1];
        // User/Cocktails/${authorId}/comments/Date.now()+'/' +${id} +'.'+fileExtension);
        cb(null, 'User/Cockctails/' + userId +'/cocktails/' +name+ '/' +Date.now() +'.'+fileExtension);
      } catch (error) {
        console.log(error);
        return;
      }
    },
  }),
});

const commentImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb) {
      const userId = req.id;
      const {authorId} = req.body;
      const fileExtension = file.mimetype.split('/')[1];
      // User/Cocktails/${authorId}/comments/Date.now()+'/' +${id} +'.'+fileExtension);
      cb(null, 'User/Cockctails/' + authorId +'/comments/' +userId + '/' +Date.now() +'.'+fileExtension);
    },
  }),
});

const myHeadUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb) {
      try {
        const userId = req.id;
        if (!req.id) {
          throw new Error('no id!');
        }
        const fileExtension = file.mimetype.split('/')[1];
        // User/Cocktails/${authorId}/comments/Date.now()+'/' +${id} +'.'+fileExtension);
        cb(null, 'User/Cockctails/' + userId +'/headpic/' +Date.now() +'.'+fileExtension);
      } catch (error) {
        console.log(error);
        return;
      }
    },
  }),
});


module.exports = {
  imageupload,
  commentImgUpload,
  myHeadUpload,
};
