$(document).ready(function() {
    $("#addBudgetBtn").on("click", function(e) {
      e.preventDefault();
  
      const budget = {
        budgetValue: $("#budgetValue").val(),
        recurVal: $("#recurVal").val(),
      };
  
      if (
        budget.budgetValue == "" ||
        budget.recurVal == ""
      ) {
        alert("You must fill out all budget information");
      } else {
        $.post("/budget/addBudget", budget, function(data) {
          console.log("Done");
          // location.reload();
          if (data) {
            alert("budget added/edit Successfully!");
            window.location.replace("/expense");
          }
        });
      }
    });
  });
  