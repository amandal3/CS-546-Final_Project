var express = require("express");

var router = express.Router();
const userData = require("../data/users");

router.get("/", function(req, res, next) {
  res.render("register");
});

router.post("/", async function(req, res, next) {
  try {
    const result = await userData.create(
      req.body.firstName,
      req.body.lastName,
      req.body.userName,
      req.body.hashPassword,
    );
    // console.log(result);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;