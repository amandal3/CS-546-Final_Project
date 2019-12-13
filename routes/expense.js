const express = require("express");

const router = express.Router();
const expenseData = require("../data/expenses");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    const allExpenses = await expenseData.getAll();
    console.log(allExpenses);
    res.render("table", { allExpenses });
  } catch (e) {
    console.log(e);
  }
});

router.get("/addExpense", function(req, res, next) {
  res.render("addExpense");
});
router.post("/addExpense", async function(req, res, next) {
  // console.log(req.body);
  // const expense = {
  //   name: req.body.name,
  //   category: req.body.category,
  //   amount: req.body.amount,
  //   comment: req.body.comment,
  //   recurring: 0
  // };
  // create(name, category, amount, comment, recurring)
  try {
    const result = await expenseData.create(
      req.body.name,
      req.body.category,
      parseFloat(req.body.amount),
      req.body.comment,
      0
    );
    console.log(result);
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
