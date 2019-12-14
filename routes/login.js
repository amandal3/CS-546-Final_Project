var express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userData = require('../data/users.js');
const bcrypt = require('bcryptjs');
const saltRounds = 16;
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("login");
});

router.post('/', async function(req, res, next) {
  //console.log("ever enter");
  let userinput = req.body;
    try{
      /*
      const hash = await bcrypt.hash(userinput.password, saltRounds);
      let uid = await userData.findByParams(userinput.firstName, userinput.lastName, userinput.username, hash);
      console.log(uid);
      */
      let users = await userData.getAll();
      console.log(req.session);
      var i=0;
      for(i=0; i < users.length; i ++){
        if(users[i].profile.firstName == userinput.firstName && users[i].profile.lastName == userinput.lastName && users[i].profile.userName == userinput.username){
          if(bcrypt.compareSync(userinput.password, users[i].profile.hashPassword)){
            req.session.user = users[i];
          }
        }
      }
      console.log("session                         ", req.session);
      if(req.session.user){
        res.redirect('/expense');
      }else{
        throw "sorry, didn't find you"
      }
   }catch(e){
     console.log(e);
     res.status(401).render('login', {message: "sorry, invalid input, try again"});
   }
});

module.exports = router;
