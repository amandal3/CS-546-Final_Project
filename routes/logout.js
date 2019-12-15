var express = require("express");

var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res){
  if(req.session.user){
      req.session.destroy();
      res.render('logout');
  }else{
      res.render('error');
  }
});
module.exports = router;
