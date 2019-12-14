var express = require("express");
const userData = require("../data/users");
const bcrypt = require("bcryptjs");
const saltRounds = 16
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("register");
});

router.post("/", async function(req, res, next) {
  try {
    console.log(req.body.username);
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const result = await userData.create(
      req.body.firstName,
      req.body.lastName,
      req.body.username,
      hash,
    );
    console.log(result);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
