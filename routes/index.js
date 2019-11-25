/*
Author: @Besnik @Amanda
*/
const expenseRoute = require("./expense"); //want to make an expense
//Login/Signup
const userRoute = require ("./users"); //signup/login
const signUpRoute = require ("./singup");
const loginRoute = require("./login");
//register
//logout
const logoutRoute = require("./logout");
//charts/Tables
const chartRoute = require("./charts");

const path = require("path");


var express = require('express');
var router = express.Router();
const constructorMethod = app => {
	app.use("/expense", expenseRoute);
	app.use("/users", userRoute);
  /*
  need to use the other routes here
  */
  app.get("/", (req, res) => {
    res.render('layout'); //
  })

	app.use("*", (req, res) => {
		res.status(404).json({ error: "Not found -- Rawr Test1"});
	});
};
/*
// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/



module.exports = router;
