const router = require('express').Router();
const DB = require('../../../utils/mysqlcon');
const isAuth = require('../../../utils/is-auth');
const Upload = require('../../../utils/photoUpload');


router.route('/headimageload')
    .post(isAuth.uploadAuth, Upload.myHeadUpload.fields([{name: 'change_headpic'}]), async (req, res)=>{
      const updateHeadsql = `UPDATE user SET user.photo = "${req.files.change_headpic[0].location}" where user.id = ?`;
      await DB.query(updateHeadsql, req.id);
      res.status(200).json({url: req.files.change_headpic[0].location});
    } );

router.route('/commentimageload')
    .post(isAuth.uploadAuth, Upload.commentImgUpload.fields([{name: 'customFile'}]), async (req, res)=>{
      res.status(200).json({url: req.files.customFile[0].location});
    } );


router.route('/imageload')
    .post(Upload.imageupload.fields([{name: 'chooseFile'}]), async (req, res)=>{
      res.status(200).json({url: req.files.chooseFile[0].location});
    } );

module.exports = router;
