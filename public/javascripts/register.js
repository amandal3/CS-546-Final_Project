/*
Author: Diaeddin Motan
*/
$(document).ready(function() {
  $("#registerBtn").on("click", function(e) {
    e.preventDefault();

    const userInfo = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      username: $("#username").val(),
      password: $("#password").val()
    };

    if (
      userInfo.firstName == "" ||
      userInfo.lastName == "" ||
      userInfo.username == "" ||
      userInfo.password == ""
    ) {
      alert("You must fill out all user information");
    } else {
      $.post("/signUp", userInfo, function(data) {
        if (data) {
          alert("User Added Successfully!");
          window.location.replace("/login");
        }
      });
    }
  });
});
