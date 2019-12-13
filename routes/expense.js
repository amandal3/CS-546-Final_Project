const express = require("express");

const router = express.Router();
const expenseData = require("../data/expenses");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    const allExpenses = await expenseData.getAll();
    // console.log(allExpenses);
    res.render("table", { allExpenses });
  } catch (e) {
    console.log(e);
  }
});

router.get("/addExpense", function(req, res, next) {
  res.render("addExpense");
});
router.post("/addExpense", async function(req, res, next) {
  try {
    const result = await expenseData.create(
      req.body.name,
      req.body.category,
      parseFloat(req.body.amount),
      req.body.comment,
      0
    );
    // console.log(result);
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/editExpense/:id", async function(req, res, next) {
  console.log(req.params.id);
  const expenseDetails = await expenseData.get(req.params.id);
  console.log(expenseDetails);
  res.render("editExpense", { expenseDetails });
});

router.put("/editExpense", async function(req, res, next) {
  // console.log(req.body);
  console.log(req.body.id);
  // async function update(id, nname, ncategory, namount, ncomment, nrecurring) {
  try {
    const updatedExpense = await expenseData.update(
      req.body.id,
      req.body.nname,
      req.body.ncategory,
      parseFloat(req.body.namount),
      req.body.ncomment,
      1
    );
    console.log(updatedExpense);
    res.render("table");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
