/*
Author: Diaeddin Motan
*/
$(document).ready(function() {
  $("#addExpenseBtn").on("click", function(e) {
    e.preventDefault();

    const expense = {
      id: $("#expenseId").attr("value"),
      nname: $("#expenseName").val()
        ? $("#expenseName").val()
        : $("#expenseName").attr("placeholder"),
      ncategory: $("#category").val()
        ? $("#category").val()
        : $("#category").attr("placeholder"),
      namount: $("#amount").val()
        ? $("#amount").val()
        : $("#amount").attr("placeholder"),
      ncomment: $("#comment").val()
        ? $("#comment").val()
        : $("#comment").attr("placeholder")
    };

    console.log(expense);

    $.ajax({
      url: "/expense/editExpense",
      type: "PUT",
      data: expense,
      success: function(result) {
        console.log(result);
        if (result) {
          alert("Expense Updated Successfully!");
          window.location.replace("/");
        }
      }
    });
    // $.put("/expense/editExpense", expense, function(data) {
    //   console.log("Done");
    //   // location.reload();
    //   if (data) {
    //     alert("Expense Updated Successfully!");
    //     window.location.replace("/");
    //   }
    // });
  });
});
