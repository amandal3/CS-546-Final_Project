/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");
const userDB = mongoColl.users;
const userID = require('mongodb').ObjectID;
const expensesFunc = require("./expenses.js")
const bcrypt = require("bcryptjs");
const saltRounds = 16;
//Gotta make it so if a delete happens here gotta delete all expenses
//Also if a expense deleted
//So here I can store users and such but
//-------------------FINDByParams--------------------//
async function findByParams(firstName,lastName, userName, hashPassword){
	if (arguments.length > 4){
    throw "More than 4 arguments were given"
  }
  if (arguments.length < 4){
    throw "Less than 4 arguments were given"
  }
  if (typeof firstName === undefined){
    throw "firstName argument is undefined"
  }
	if (typeof lastName === undefined){
    throw "lastName argument is undefined"
  }
	if (typeof userName === undefined){
    throw "userName argument is undefined"
  }
	if (typeof hashPassword === undefined){
    throw "hashPassword argument is undefined"
  }
  if (typeof firstName !== 'string'){
    throw "The firstName given is not a string"
  }
	if (typeof lastName !== 'string'){
    throw "The lastName given is not a string"
  }
	if (typeof userName !== 'string'){
    throw "The userName given is not a string"
  }
	if (typeof hashPassword !== 'string'){
    throw "The hashPassword given is not a string"
  }
	const allUsers = await userDB();
	const theUser = await allUsers.findOne({profile: {firstName: firstName, lastName:lastName, userName: userName, hashPassword: hashPassword}});
	const usrID = theUser._id;

	return usrID.toString();
}
//-------------------REMOVE EXPENSE--------------------//
async function removeExp(expID, usrID){
	if (arguments.length > 2){
		throw "More than 2 argument was given"
	}
	if (arguments.length < 2){
		throw "Less than 2 argument was given"
	}
	if (typeof expID !== 'string'){
		throw "expid given was not a string"
	}
	if (typeof usrID !== 'string'){
		throw "usrid given was not a string"
	}
  const expenseID = userID(expID);
	const useID = userID(usrID);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
		throw "No current expense inside with that ID"
	}
	//find the user and remove the expense ID in it
	const possibleExpense = await allUsers.updateOne({_id:useID}, {$pull: {expenses: expenseID}});
	const possibleRecurrExpense = await allUsers.updateOne({_id:useID}, {$pull: {recurringExpenses: expenseID}});
	if (possibleExpense === null && possibleRecurrExpense === null){
		throw "Removal of expense id from user array was attempted but it found nothing in both arrays"
	}
	let arr = [possibleExpense,possibleRecurrExpense]; //incase you want both and easier to tell then on route side code which was null
	return arr;
}
//-------------------ADD EXPENSE--------------------//
async function addExp(expID, usrID, recurr){
	if (arguments.length > 3){
		throw "More than 3 argument was given"
	}
	if (arguments.length < 3){
		throw "Less than 3 argument was given"
	}
	if (typeof expID !== 'string'){
		throw "expid given was not a string"
	}
	if (typeof usrID !== 'string'){
		throw "usrid given was not a string"
	}
	if (typeof recurr !== 'number'){
		throw "recurr given was not a number"
	}
	if (Number.isNaN(recurr)){
    throw "The recurr flag given is not a number" //safety net cause can bypass top easily maybe not sure better safely redundant I say
  }
	if(recurr > 5 || recurr < 0){
		throw "Invalid recurr parameter was passed, check the types dumbo"
	}
  const expenseID = userID(expID);
	const useID = userID(usrID);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
		throw "No current expense inside with that ID"
	}
	if (recurr === 5){//if 5 then its a normal expense I CANT STRESS THIS ALONG WITH OTHER COMMENTS
		const possibleExpense = await allUsers.updateOne({_id:useID}, {$addToSet: {expenses: expenseID}});
		return possibleExpense;
	}
	else{//then it is a recurring one
		const possibleRecurrExpense = await allUsers.updateOne({_id:useID}, {$addToSet: {recurringExpenses: expenseID}});
		return possibleRecurrExpense;
	}
	//cant do the double arr return here cause we don't want to add it to both
}
//-------------------CREATE--------------------//
async function create(firstName, lastName, userName, hashPassword){ //make expense
	//Should just recieve name of the expense or recieving multiple ids?
	if (arguments.length > 4){
    throw "More than 4 arguments were given"
  }
  if (arguments.length < 4){
    throw "Less than 4 arguments were given"
  }
  if (typeof firstName === undefined){
    throw "firstName argument is undefined"
  }
	if (typeof lastName === undefined){
    throw "lastName argument is undefined"
  }
	if (typeof userName === undefined){
    throw "userName argument is undefined"
  }
	if (typeof hashPassword === undefined){
    throw "hashPassword argument is undefined"
  }
  if (typeof firstName !== 'string'){
    throw "The firstName given is not a string"
  }
	if (typeof lastName !== 'string'){
    throw "The lastName given is not a string"
  }
	if (typeof userName !== 'string'){
    throw "The userName given is not a string"
  }
  //password gets sent through after hashing
	if (typeof hashPassword !== 'string'){
    throw "The hashPassword given is not a string"
  }

  const allUsers = await userDB();
  let newUser = {
    usersBudget: [null, null, null, null], //budget order is daily/weekly/monthly/yearly -- 1/2/3/4
    expenses: [],
    recurringExpenses: [],
    profile: {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      hashPassword: hashPassword
    }
	};
  await allUsers.insertOne(newUser);
	if (allUsers.insertedCount === 0){
    throw "We couldn't add that user"
  }
	const newUserID = allUsers.insertedId;

  return newUser;
}
//-------------------UPDATEBUDGET--------------------//
async function updateBudget(id,value,recurringVal){
	//need to pass in userID, vlaue,recurring value
	if (arguments.length > 3) {
    throw "The amount of arguments given was more than 3";
  }
  if (arguments.length < 3) {
    throw "The number of arguments given was less than 3";
  }
	if (typeof id === undefined) {
    throw "The id given was not of type string/can't be converted to an ObjectID";
  }
  if (typeof id !== "string") {
    throw "A non string argument was given";
  }
	if (recurringVal > 5 || recurringVal < 0){
		throw "gave a value outside current accepted range"
	}
	if (recurringVal === 5){ //make this 5 a 4 which becomes a 3 anyway
		console.log('Im considering it as a yearly one')//just a warning, gonna consider it yearly
	}
	if (typeof value !== 'number'){
		throw "Value given wasn't a number"
	}
	if (typeof recurringVal !== 'number'){
		throw "recurringVal given wasn't a number"
	}
	if (Number.isNaN(value)){
		throw "valuve given isn't a number still"
	}
	if (Number.isNaN(recurringVal)){
		throw "go home dog. Use as intended"
	}
	//noooooooW hold correct index
	let trueIndex = 0;
	if (recurringVal === 5){
		trueIndex = 3;
	}
	else{
		trueIndex = recurringVal - 1;
	}
	//daily/weekly/monthly/yearly -- 1/2/3/4
	//array index is then 					0 1 2 3 <-- see simple math
	const useID = userID(id); //no need to feel bad, wasn't easily explained lol
	const allUsers = await userDB();//corgo blep
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
	//Just break out earlier than doing nothing lol
		throw "No current user inside with that ID"
	}
	//nope thinking on how to cheese this like I did hw7
	let theBudArr = possibleUser.usersBudget; // holds []
	theBudArr[trueIndex] = value; //does this work? <--created a new one here
	//wanna see the cheese
	let newUserUpdate = await allUsers.updateOne({_id:useID}, {$set: {usersBudget: theBudArr}}); //push new budget list here aka update
	//just replace the UserBudget in user cause we only replacing one so it'll keep others the same
	return newUserUpdate;
}
//-----------------checkIfBudgetExist----------------------//
async function doesBudValExist(id,recurringVal){
	//
	if (arguments.length > 2) {
    throw "The amount of arguments given was more than 2";
  }
  if (arguments.length < 2) {
    throw "The number of arguments given was less than 2";
  }
	if (typeof id === undefined) {
    throw "The id given was not of type string/can't be converted to an ObjectID";
  }
  if (typeof id !== "string") {
    throw "A non string argument was given";
  }
	if (recurringVal > 5 || recurringVal < 0){
		throw "gave a value outside current accepted range"
	}
	if (recurringVal === 5){ //make this 5 a 4 which becomes a 3 anyway
		console.log('Im considering it as a yearly one')//just a warning, gonna consider it yearly
	}
	if (typeof recurringVal !== 'number'){
		throw "recurringVal given wasn't a number"
	}
	if (Number.isNaN(recurringVal)){
		throw "go home dog. Use as intended"
	}
	//
	let trueIndex = 0;
	if (recurringVal === 5){
		trueIndex = 3;
	}
	else{
		trueIndex = recurringVal - 1;
	}
	//daily/weekly/monthly/yearly -- 1/2/3/4
	//array index is then 					0 1 2 3 <-- see simple math
	const useID = userID(id);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
	//Just break out earlier than doing nothing lol
		throw "No current user inside with that ID"
	}
	let theBudArr = possibleUser.usersBudget; // holds []
	if (theBudArr[trueIndex] !== null){
		return true //yeah budget exist
	}
	else{
		return false;//budget does not exist
	}
}
//-------------------UPDATE--------------------//
async function update(id, nFname, nLname, nUserName, nHashPass){ //make expense
	//Should just recieve name of the expense or recieving id?
	if (arguments.length > 5) {
    throw "The amount of arguments given was more than 5";
  }
  if (arguments.length < 5) {
    throw "The number of arguments given was less than 5";
  }
  if (typeof id === undefined) {
    throw "The id given was not of type string/can't be converted to an ObjectID";
  }
  if (typeof id !== "string") {
    throw "A non string argument was given";
  }
  //if type of argument is not null or not a string
  if (typeof nFname !== 'string'){
    if (typeof nFname !== "object"){
      throw "Arg2 missing"
    }
  }
  if (typeof nLname !== 'string'){
    if (typeof nLname !== "object"){
      throw "Arg3 missing"
    }
  }
  if (typeof nUserName !== 'string'){
    if (typeof nUserName !== "object"){
      throw "Arg4 missing"
    }
  }
  if (typeof nHashPass !== 'string'){
    if (typeof nHashPass !== "object"){
      throw "Arg5 missing"
    }
  }
  const useID = userID(id);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
	//Just break out earlier than doing nothing lol
		throw "No current user inside with that ID"
	}

	if (nFname !== possibleUser.profile.firstName && nFname !== null){
		const newFNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.firstName": nFname}});
	}

	if (nLname !== possibleUser.profile.lastName && nLname !== null){
		const newLNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.lastName": nLname}});
	}

	if (nUserName !== possibleUser.profile.userName && nUserName !== null){
		const newUsrNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.userName": nUserName}});
	}

	if (nHashPass !== possibleUser.profile.hashPassword && nHashPass !== null){
		const newAmtChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.hashPassword": nHashPass}});
	}
	//if wanna change comment/description
	const possibleUser2 = await allUsers.findOne({_id:useID});

	return possibleUser2;
}
//-------------------REMOVE--------------------//
async function Remove(id){
	//
	if (arguments.length > 1){
		throw "The amount of arguments given was more than 1"
	}
	if (arguments.length < 1){
		throw "The number of arguments given was less than 1"
	}
	if (typeof id === undefined){
		throw "The id given was not of type string/can't be converted to an ObjectID"
	}
	if (typeof id !== "string"){
		throw "A non string argument was given"
	}
	const useID = userID(id);
	const allUsers = await userDB();

	const possibleUser = await allUsers.findOne({_id: useID});
	if (possibleUser === null){
		throw "No current User inside with that ID"
	}
  const yoinkedUsr = await allUsers.removeOne({_id: useID});
	if (yoinkedUsr.deletedCount === 0){
    throw "We could not delete the User with that id Given"
  }
	//if we get here then we are holding the User with the information
	let expArry = possibleUser.expenses;
	let recurrExpArry = possibleUser.recurringExpenses;
	let bothExpenses = [expArry, recurrExpArry];
	return bothExpenses;//holds all ids that need to be removed, parse through at routes section
}
//-------------------Retrive One--------------------//
async function get(id) {
  if (arguments.length > 1) {
    throw "The amount of arguments given was more than 1";
  }
  if (arguments.length < 1) {
    throw "The amount of arguments given was less than 1";
  }
  if (typeof id !== "string") {
    throw "The ID argument is needed to be passed in as a string";
  }
  if (id === undefined) {
    throw "need ID to be provided";
  }
  const useID = userID(id);
  const allUsers = await userDB();
  const theUser = await allUsers.findOne({ _id: useID });
  if (theUser === null) {
    throw "There exists no user with that ID";
  }
  return theUser;
}
//-------------------GETALL--------------------//
async function getAll(){
	if (arguments.length > 0){
    console.log("Some arguments were passed but not needed");
  }
	const allUsers = await userDB();
	const users = await allUsers.find({}).toArray();
	return users;
}
//-------------------RecieveUserByLogin--------------------//
async function checkUsr(usrName, password){
	if (arguments.length > 2){
    throw "Too many arguments were given"
  }
	if (arguments.length < 2){
    throw "Too little arguments were given"
  }
	if (usrName === undefined){
		throw "usrName is needed"
	}
	if (password === undefined){
		throw "password is needed"
	}
	if (typeof password !== 'string'){
		throw "password needs to be of string"
	}
	if (typeof usrName !== 'string'){
		throw "Username needs to be of string"
	}
	const allUsers = await userDB();
	const users = await allUsers.find({}).toArray();
	let i = 0;
	let lowerUsrName = usrName.toLowerCase();
	for (i;i<users.length;i++){
		//grab each Object
		let storedName = users[i].profile.userName;
		let lowerStoredN = storedName.toLowerCase();
		if (lowerUsrName === lowerStoredN){
			const hash = await bcrypt.hash(password, saltRounds); //hash the password
			const comparison = await bcrypt.compare(hash, users[i].profile.hashPassword); //compare the current hash password and stored password
			if (comparison === true){
				return user[i]; //I'll give you the entire UserObject, do what you wish with it
			}
		}
	}
	return false; //return false cause no user was found
}
module.exports = {
	findByParams,
	checkUsr,
	update,
	create,
	Remove,
	doesBudValExist,
	updateBudget,
	removeExp,
	addExp,
	getAll,
	get
}
