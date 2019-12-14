const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();
const userData = require("../data/users");

router.use(cookieParser());
router.use(express.json()); // for parsing application/json
router.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
  }))

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    if(!req.session.user){
        throw "you are not log in, no record";
    }
    const user = req.session.user;
    const userBudget = {
        "daily": user.usersBudget[0],
        "weekly": user.usersBudget[1],
        "monthly": user.usersBudget[2],
        "yearly": user.usersBudget[3]
    };
    // console.log(allExpenses);
    res.render("budgetlist", { userBudget });
  } catch (e) {
    console.log(e);
    res.redirect('/signUp');
  }
});

router.get("/addBudget", function(req, res, next) {
  res.render("addBudget");
});
router.post("/addBudget", async function(req, res, next) {
  try {
    const result = await userData.updateBudget(
      req.session.user.id,
      parseFloat(req.body.budgetValue),
      parseInt(req.body.recurVal)
    );
    // console.log(result);
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
