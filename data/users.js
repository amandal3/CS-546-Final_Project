/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");
const userDB = mongoColl.users;
const userID = require('mongodb').ObjectID;
const expensesFunc = require("./expenses.js")
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
	if (typeof expid !== 'string'){
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
	if (typeof expid !== 'string'){
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
    usersBudget: [],
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

//-------------------UPDATE--------------------//
async function update(id, nFname, nLname, nUserName, nHashPass){ //make expense
	//Should just recieve name of the expense or recieving id?
	if (typeof id !== 'string'){
		throw "id given was not a string"
	}
  const useID = userID(id);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
	//Just break out earlier than doing nothing lol
		throw "No current user inside with that ID"
	}

	if (nFname !== possibleUser.profile.firstName && nFname !== null){
		const newFNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.$.firstName": nFname}});
	}

	if (nLname !== possibleUser.profile.lastName && nLname !== null){
		const newLNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.$.lastName": nLname}});
	}

	if (nUserName !== possibleUser.profile.userName && nUserName !== null){
		const newUsrNameChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.$.userName": nUserName}});
	}

	if (nHashPass !== possibleUser.profile.hashPassword && nHashPass !== null){
		const newAmtChange = await allUsers.updateOne({_id:useID}, {$set: {"profile.$.hashPassword": nHashPass}});
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
  const yoinkedUsr = await allExpenses.removeOne({_id: useID});
	if (yoinkedUsr.deletedCount === 0){
    throw "We could not delete the User with that id Given"
  }
	//if we get here then we are holding the User with the information
	let expArry = yoinkedUsr.expenses;
	let recurrExpArry = yoinkedUsr.recurringExpenses;
	let bothExpenses = [expArry, recurrExpArry];
	return bothExpenses;//holds all ids that need to be removed, parse through at routes section
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

module.exports = {
	findByParams,
	update,
	create,
	remove,
	removeExp,
	addExp,
	getAll
}
