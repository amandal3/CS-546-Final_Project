/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");
const expenseDB = mongoColl.expenses;
//  users: getCollectionFn("users"),
const expenseID = require('mongodb').ObjectID;

async function create(name, category, amount, comment, recurring){ //make expense
	//Should just recieve name of the expense or recieving multiple ids?
	if (arguments.length > 5){
    throw "More than 5 arguments were given"
  }
  if (arguments.length < 5){
    throw "Less than 5 arguments were given"
  }
	if (typeof name === undefined){
    throw "Name argument is undefined"
  }
	if (typeof category === undefined){
    throw "category argument is undefined"
  }
	if (typeof amount === undefined){
    throw "amount argument is undefined"
  }
	if (typeof comment === undefined){
    throw "Comment argument is undefined"
  }
	if (typeof recurring === undefined){
    throw "recurring argument is undefined"
  }
  if (typeof name !== 'string'){
    throw "The name given is not a string"
  }
	if (typeof category !== 'string'){
    throw "The category given is not a string"
  }
	if (typeof comment !== 'string'){
    throw "The comment given is not a string"
  }
	if (typeof recurring !== 'number'){
    throw "The recurring given is not a string"
  }
	if (typeof amount !== 'number'){
    throw "The amount given is not a float"
  }
	if (Number.isNaN(amount)){
    throw "The amount given is still not a float" //safety net cause can bypass top easily
  }
	if (Number.isNaN(recurring)){
    throw "The recurring given is still not a INT" //safety net cause can bypass top easily
  }
	const allExpenses = await expenseDB();
	/*
	//id - string -- make here
	//category - string
	//date Currently - an object with
	/*
		year - number (4 digit)
		month - number
		date - number day during month
		day - mon - sun
	*/
	//amount - float
	//comment- string

	var today - new Date();
	var recurringTime = new Date(year, month, day);
	let newExpense = {
		category: category,
		date: {
			year: today.getFullYear(),
			month: today.getMonth(),
			date: today.getDate(),
			day: today.getDay()
					},
		reccuring:{
			shoudlRecurr:reccuring,
			lastTimeOccur: recurringTime
		},
		amount: amount,
		comment: comment
	};
	await allExpenses.insertOne(newExpense);
	if (allExpenses.insertedCount === 0){
    throw "We couldn't add that animal (pokemon)"
  }
	const newExpenseID = allExpenses.insertedId;
	/*
	id: sdnfadgfyladgfhsadbf
	category: category,
	date: {
		year: today.getFullYear(),
		month: today.getMonth(),
		date: today.getDate(),
		day: today.getDay()
				},
	amount: amount,
	comment: comment
	*/
	return newExpense;//??? dont need it but for debugging
}
