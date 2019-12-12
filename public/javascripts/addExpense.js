/*
Author: Diaeddin Motan
*/
$(document).ready(function() {
  $("#addExpenseBtn").on("click", function(e) {
    e.preventDefault();

    const expense = {
      name: $("#expenseName").val(),
      category: $("#category").val(),
      amount: $("#amount").val(),
      comment: $("#comment").val()
    };

    if (
      expense.name == "" ||
      expense.category == "" ||
      expense.amount == "" ||
      expense.comment == ""
    ) {
      alert("You must fill out all expense information");
    } else {
      $.post("/expense/addExpense", expense, function(data) {
        console.log("Done");
        // location.reload();
        if (data) {
          alert("Expense Added Successfully!");
          window.location.replace("/");
        }
      });
    }
  });
});
