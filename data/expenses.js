/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");

const expenseDB = mongoColl.expenses;
//  users: getCollectionFn("users"),
const expenseID = require("mongodb").ObjectID;
const usersFunc = require("./users.js");


//-------------------FindByParametes--------------------//
async function findByParams(name,category, amount, comment, recurring){
	/*
	call function to get id prior to making request to other functions
	meaning if in routes you need to do a remove, call this function first to grab an id
	then with this id, pass it in to functions that need it
	*/
  if (arguments.length > 5) {
    throw "More than 5 arguments were given";
  }
  if (arguments.length < 5) {
    throw "Less than 5 arguments were given";
  }
  if (typeof name === undefined) {
    throw "Name argument is undefined";
  }
  if (typeof category === undefined) {
    throw "category argument is undefined";
  }
  if (typeof amount === undefined) {
    throw "amount argument is undefined";
  }
  if (typeof comment === undefined) {
    throw "Comment argument is undefined";
  }
  if (typeof recurring === undefined) {
    throw "recurring argument is undefined";
  }
  if (typeof name !== "string") {
    throw "The name given is not a string";
  }
  if (typeof category !== "string") {
    throw "The category given is not a string";
  }
  if (typeof comment !== "string") {
    throw "The comment given is not a string";
  }
  if (typeof recurring !== "number") {
    throw "The recurring given is not a string";
  }
  if (typeof amount !== "number") {
    throw "The amount given is not a float";
  }
  if (Number.isNaN(amount)) {
    throw "The amount given is still not a float"; //safety net cause can bypass top easily
  }
  if (Number.isNaN(recurring)) {
    throw "The recurring given is still not a INT"; //safety net cause can bypass top easily
  }
  const allExpenses = await expenseDB();
  const theExpense = await allExpenses.findOne({
    name: name,
    category: category,
    comment: comment,
    recurring: recurring.toString(),
    amount: amount.toString()
  });

  const theId = theExpense._id; //grab the id of that specific expense

  return theId.toString(); //I am returning it as a string no matter what
}
//-------------------CREATE--------------------//
async function create(name, category, amount, comment, recurring) {
  //make expense
  //Should just recieve name of the expense or recieving multiple ids?
  if (arguments.length > 5) {
    throw "More than 5 arguments were given";
  }
  if (arguments.length < 5) {
    throw "Less than 5 arguments were given";
  }
  if (typeof name === undefined) {
    throw "Name argument is undefined";
  }
  if (typeof category === undefined) {
    throw "category argument is undefined";
  }
  if (typeof amount === undefined) {
    throw "amount argument is undefined";
  }
  if (typeof comment === undefined) {
    throw "Comment argument is undefined";
  }
  if (typeof recurring === undefined) {
    throw "recurring argument is undefined";
  }
  if (typeof name !== "string") {
    throw "The name given is not a string";
  }
  if (typeof category !== "string") {
    throw "The category given is not a string";
  }
  if (typeof comment !== "string") {
    throw "The comment given is not a string";
  }
  if (typeof recurring !== "number") {
    throw "The recurring given is not a string";
  }
  if (typeof amount !== "number") {
    throw "The amount given is not a float";
  }
  if (Number.isNaN(amount)) {
    throw "The amount given is still not a float"; //safety net cause can bypass top easily
  }
  if (Number.isNaN(recurring)) {
    throw "The recurring given is still not a INT"; //safety net cause can bypass top easily
  }
  const allExpenses = await expenseDB();

  var today = new Date();
  var recurringTime = new Date(year, month, day);
  let newExpense = {
    name: name,
    category: category,
    date: {
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate(),
      day: today.getDay()
    },
    reccuring: {
      shoudlRecurr: reccuring, //pass in 'yes' or 'no' or '1' or '0'
      lastTimeOccur: recurringTime
    },
    amount: amount,
    comment: comment
  };
  await allExpenses.insertOne(newExpense);
  if (allExpenses.insertedCount === 0) {
    throw "We couldn't add that expense";
  }
  const newExpenseID = allExpenses.insertedId;
  /*
	id: sdnfadgfyladgfhsadbf
	name: name,
	category: category,
	date: {
		year: today.getFullYear(),
		month: today.getMonth(),
		date: today.getDate(),
		day: today.getDay()
				},
	recurring: {
		shouldlRecurr: recurring,
		lastTimeOccur: recurringTime
	},
	amount: amount,
	comment: comment
	*/
	//need to call in User function to add
	let importantArr = [newExpenseID, recurring]; //I want this to pass the expense ID and recurring number for user function ot be called next
	return importantArr;//??? dont need it but for debugging
}

//-------------------UPDATE--------------------//
async function update(id, nname, ncategory, namount, ncomment, nrecurring) {
  //make expense
  //Should just recieve name of the expense or recieving id?
  const expID = expenseID(id); //if id gets pass
  const allExpenses = await expenseDB();
  const possibleExp = await allExpenses.findOne({ _id: expID });
  if (possibleExp === null) {
    //Just break out earlier than doing nothing lol
    throw "No current expense inside with that ID";
  }
  //so currently the actual expense we want to update is possibleExp
  //Hard assumption here, can it pass through previous information and old?
  //easier to do as one big update or each individual?]
  if (nname !== possibleExp.name && nname !== null) {
    //then name got change
    //then the name is getting updated
    //repeat this for others
    const newNameChange = await allExpenses.updateOne(
      { _id: expID },
      { $set: { name: newname } }
    );
  }
  //if wanna change the category
  if (ncategory !== possibleExp.category && ncategory !== null) {
    //then name got change
    const newCatChange = await allExpenses.updateOne(
      { _id: expID },
      { $set: { category: ncategory } }
    );
  }
  //if wanna change recurring status
  if (
    nrecurring !== possibleExp.recurring.shouldlRecurr &&
    nrecurring !== null
  ) {
    //then name got change
    const newRecChange = await allExpenses.updateOne(
      { _id: expID },
      { $set: { "recurring.$.amount": nrecurring } }
    );
  }
  //if wanna change amount
  if (namount !== possibleExp.amount && namount !== null) {
    //then name got change
    const newAmtChange = await allExpenses.updateOne(
      { _id: expID },
      { $set: { amount: namount } }
    );
  }
  //if wanna change comment/description
  if (ncomment !== possibleExp.amount && ncomment !== null) {
    //then name got change
    const newComChange = await allExpenses.updateOne(
      { _id: expID },
      { $set: { comment: ncomment } }
    );
  }
  const possibleExp2 = await allExpenses.findOne({ _id: expID });

  return possibleExp2;
}

//-------------------REMOVE--------------------//
async function Remove(id) {
  //
  if (arguments.length > 1) {
    throw "The amount of arguments given was more than 1";
  }
  if (arguments.length < 1) {
    throw "The number of arguments given was less than 1";
  }
  if (typeof id === undefined) {
    throw "The id given was not of type string/can't be converted to an ObjectID";
  }
  if (typeof id !== "string") {
    throw "A non string argument was given";
  }
  const expID = expenseID(id);
  const allExpenses = await expenseDB();
	const possibleExp = await allExpenses.findOne({_id: expID});
	if (possibleExp === null){
		throw "No current expense inside with that ID"
	}
  const yoinkedExp = await allExpenses.removeOne({_id: expID});
	if (yoinkedExp.deletedCount === 0){
    throw "We could not delete the animal with that id Given"
  }
	//gotta remove it from the users array
	////best to just link the two in some way but not access the mongo on both but individual
	//

	return yoinkedExp;
}
//-------------------Retrive One--------------------//
async function get(id) {
  if (arguments.length > 1) {
    throw "The amount of arguments given was more than 1";
  }
  if (argument.length < 1) {
    throw "The amount of arguments given was less than 1";
  }
  if (typeof id !== "string") {
    throw "The ID argument is needed to be passed in as a string";
  }
  if (id === undefined) {
    throw "need ID to be provided";
  }
  const expID = expenseID(id);
  const allExpenses = await expenseDB();
  const theExpense = await allExpenses.findOne({ _id: expID });
  if (theExpense === null) {
    throw "There exists no expense with that ID";
  }
  return theExpense;
}
//-------------------RETRIVE ALL--------------------//
async function getAll() {
  if (arguments.length > 0) {
    console.log("Some arguments were passed but not needed");
  }
  const allExpenses = await expenseDB();
  const expenses = await allExpenses.find({}).toArray();
  return expenses;
}

module.exports = {
  find,
  create,
  Remove,
  update,
  get,
  getAll
};
