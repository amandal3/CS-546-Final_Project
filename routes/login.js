var express = require("express");

var router = express.Router();
const userData = require("../data/users");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/", async function (req, res, next) {
  console.log("hello!");
  let userinput = req.body;
  console.log(userinput);
  //console.log(userData.checkUsr(userinput.username, userinput.password));
  if (!userinput.username || !userinput.password) {
    console.log("asdfasf");
    //res.send(500,'Please enter both username and password') 
    res.status(401).render("login", { message: "Please enter both username and password" });
  } else {
    const loginSuccess = await userData.checkUsr(userinput.username, userinput.password);
    console.log(loginSuccess);
    //userData.checkUsr(userinput.username, userinput.password) === false) {
    // res.status(401).render('login', {message: "no found based on yout input"});    
    if (loginSuccess === false) {
      res.status(401).render('login', { message: "no found based on yout input" });
    } else {
      res.redirect('../index');
    }
  }
  // res.render("login");
});

module.exports = router;

