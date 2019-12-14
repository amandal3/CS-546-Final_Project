const express = require("express");
const router = express.Router();
const userData = require("../data/users");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    console.log("ever enter");
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
    console.log(userBudget.daily);
    res.render("budgetlist", { userBudget });
  } catch (e) {
    console.log(e);
    res.redirect('/login');
  }
});

router.get("/addBudget", function(req, res, next) {
  res.render("addBudget");
});
router.post("/addBudget", async function(req, res, next) {
  try {
    console.log(req.session.user);
    if(!req.session.user){
      throw "you are not log in, no record";
    }
    console.log(req.body.budgetValue, req.body.recurVal);
    const result = await userData.updateBudget(
      req.session.user._id.toString(),
      parseFloat(req.body.budgetValue),
      parseInt(req.body.recurVal)
    );
    console.log(result);
    res.redirect("/budget");
  } catch (e) {
    console.log(e);
    res.redirect('/login');
  }
});

module.exports = router;
