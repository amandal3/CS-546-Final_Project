/*
Author: @Besnik @Amanda
*/
// const path = require("path");
const usersRouter = require("./users");
const expenseRoute = require("./expense");
const signUpRoute = require("./signUp");
const loginRoute = require("./login");
const logoutRoute = require("./logout");
const chartRoute = require("./charts");

const constructorMethod = app => {
  app.get("/", (req, res) => {
    //does this go to layout or index? Both display something different
    res.render("layout");
  });
  app.use("/users", usersRouter);
  app.use("/expense", expenseRoute);
  app.use("/signUp", signUpRoute);
  app.use("/login", loginRoute);
  app.use("/logout", logoutRoute);
  app.use("/charts", chartRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found -- Rawr Test1" });
  });
};
/*
// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = constructorMethod;
