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
//-------------------FIND_ID--------------------//
async function find(firstName,lastName, userName, hashPassword){
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
  const useID = userID(id);
	const allUsers = await userDB();
	const possibleUser = await allUsers.findOne({_id:useID});
	if (possibleUser === null){
	//Just break out earlier than doing nothing lol
		throw "No current expense inside with that ID"
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
