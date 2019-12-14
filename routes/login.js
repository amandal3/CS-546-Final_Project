var express = require("express");

var router = express.Router();
var userData = require("../data/users");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("login");
});

router.post("/checkLogin", async function(req, res, next) {
  try {
    console.log("We are going to check the user");
    userData.checkUsr(req.body.username,req.body.password);
    
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

