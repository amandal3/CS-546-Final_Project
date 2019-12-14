$(document).ready(function() {
    $("#loginBtn").on("click", function(e) {
      e.preventDefault();
  
      const user = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        username: $("#username").val(),
        password: $("#password").val()
      };
  
      if (
        user.firstName == "" ||
        user.lastName == "" ||
        user.username == "" ||
        user.password == ""
      ) {
        alert("You must fill out all user information");
      } else {
        $.post("/login", user, function(data) {
          console.log("Done");
          // location.reload();
          if (data) {
            alert("log in Successfully!");
            window.location.replace("/expense");
          }
        });
      }
    });
  });
  