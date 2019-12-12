/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");
const mongoConn = require("./../mongo/mongoConnection");
const expensesFunc = require("./expenses.js")
const usersFunc = require("./users.js");
const expenseDB = mongoColl.expenses;
const userDB = mongoColl.users;

async function main() {
  const db = await mongoConn();
  console.log('Make a User');
  try {
    //firstName, lastName, userName, hashPassword
    let newUser = await usersFunc.create('Bill','Parcell','BestGMenCoach','CoughlinGoodToo')
    console.log(newUser);
  }
  catch (e){
    console.error(e);
  }
  console.log('Make a static expense by itself so not connected to user');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.10,'The greatest gift to a gootball franchise',5)
    console.log(newExpense[0]);
  }
  catch (e){
    console.error(e);
  }
  console.log('Make an expense and connect it to a user');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTester','Test')
    let newUserId = newUser._id;
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    //console.log(newExpense[1])
    let userAddExp = await usersFunc.addExp(String(newExpense[1]),String(newUserId),newExpense[2]);
    let updatedUser = await usersFunc.get(String(newUserId));
    console.log(updatedUser);
  }
  catch (e){
    console.error(e);
  }

  console.log('Make a recurring expense and connect it to a user');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test2','Testing2','LeTester2','Test2')
    let newUserId = newUser._id;
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',3)
    //console.log(newExpense[1])
    let userAddExp = await usersFunc.addExp(String(newExpense[1]),String(newUserId),newExpense[2]);
    let updatedUser = await usersFunc.get(String(newUserId));
    console.log(updatedUser);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make an expense and update all options');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newExpense = await expensesFunc.create('1','1',1,'1',1);//ima just make em 2
    //console.log(newExpense[1])
    //id, nname, ncategory, namount, ncomment, nrecurring
    let updatedExp = await expensesFunc.update(String(newExpense[1]),'2','2',2,'2',2)
    console.log(updatedExp);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make an expense and update some options');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newExpense = await expensesFunc.create('1','1',1,'1',1);//ima just make em 2
    //console.log(newExpense[1])
    //id, nname, ncategory, namount, ncomment, nrecurring
    let updatedExp = await expensesFunc.update(String(newExpense[1]),null,'2',null,'2',2)
    console.log(updatedExp);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make an expense and remove it');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newExpense = await expensesFunc.create('1','1',1,'1',1);//ima just make em 2
    //console.log(newExpense[1])
    //id, nname, ncategory, namount, ncomment, nrecurring
    let updatedExp = await expensesFunc.Remove(String(newExpense[1]))
    let findRemovedLuL = await expensesFunc.get(String(newExpense[1]))
    console.log(findRemovedLuL);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make an expense and remove it from User after adding it');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test2','Testing2','LeTester2','Test2')
    let newUserId = newUser._id;
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    //console.log(newExpense[1])
    let userAddExp = await usersFunc.addExp(String(newExpense[1]),String(newUserId),newExpense[2]);
    let updatedUser = await usersFunc.get(String(newUserId));
    console.log(updatedUser)
    console.log('THIS SERVES AS BREAK BETWEEN BOTH USERS')
    let updatedExp = await expensesFunc.Remove(String(newExpense[1]))
    let userloseExp = await usersFunc.removeExp(String(newExpense[1]),String(newUserId));
    let updatedUser2 = await usersFunc.get(String(newUserId));
    console.log(updatedUser2);
  }
  catch (e){
    console.error(e);
  }
  console.log('Let us make a User and remove them');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTesterDow','Test')
    let newUserId = newUser._id;
    let removedUser = await usersFunc.Remove(String(newUserId));
    //console.log(removedUser);
    let attemptFind = await usersFunc.get(String(newUserId));
    console.log(attemptFind);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make a User and Update all parameters');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTesterDow','Test')
    let newUserId = newUser._id;
    //update(id, nFname, nLname, nUserName, nHashPass)
    let updatedUser = await usersFunc.update(String(newUserId),'Patrick','Hill','PHillDog','Password');
    //console.log(removedUser);
    let attemptFind = await usersFunc.get(String(newUserId));
    console.log(attemptFind);
  }
  catch (e){
    console.error(e);
  }
  console.log('Let us make a User and Update some parameters');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTesterDow','Test')
    let newUserId = newUser._id;
    //update(id, nFname, nLname, nUserName, nHashPass)
    let updatedUser = await usersFunc.update(String(newUserId),null,'Hill','PHillDog',null);
    //console.log(removedUser);
    let attemptFind = await usersFunc.get(String(newUserId));
    console.log(attemptFind);
  }
  catch (e){
    console.error(e);
  }

  console.log('Let us make a User and give them 2 expenses, remove user and see what we get');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTesterDow','Test')
    let newUserId = newUser._id;
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    let userAddExp = await usersFunc.addExp(String(newExpense[1]),String(newUserId),newExpense[2]);

    let newExpense2 = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    let userAddExp2 = await usersFunc.addExp(String(newExpense2[1]),String(newUserId),newExpense2[2]);
    let attemptFind = await usersFunc.get(String(newUserId));
    console.log(attemptFind)
    let removedUser = await usersFunc.Remove(String(newUserId));
    console.log(removedUser);
  }
  catch (e){
    console.error(e);
  }

  console.log('Do same as above but now present for loops to delete ');
  try {
    //amt and recurring are numbers
    //(name, category, amount, comment, recurring)
    let newUser = await usersFunc.create('Test','Testing','LeTesterDow','Test')
    let newUserId = newUser._id;
    let newExpense = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    let userAddExp = await usersFunc.addExp(String(newExpense[1]),String(newUserId),newExpense[2]);

    let newExpense2 = await expensesFunc.create('Super Bowl','Football',1.50,'The greatest gift to a gootball franchise',5)
    let userAddExp2 = await usersFunc.addExp(String(newExpense2[1]),String(newUserId),newExpense2[2]);
    let attemptFind = await usersFunc.get(String(newUserId));
    console.log(attemptFind)
    let removedUser = await usersFunc.Remove(String(newUserId));
    var i;
    let testingExpId = String(removedUser[0][0])
    console.log(testingExpId)
    for (i = 0; i <removedUser.length;i++){
      //parse through array of length 2
      var j;
      for (j=0;j<removedUser[i].length;j++){
        //call in remove/delete expense
        let removalExp = await expensesFunc.Remove(String(removedUser[i][j]))
      }
    }
    let trytofindExp = await expensesFunc.get(testingExpId);
    console.log(trytofindExp);
  }
  catch (e){
    console.error(e);
  }
}

main();
