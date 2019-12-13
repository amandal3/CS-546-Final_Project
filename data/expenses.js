/*
Author: @Besnik @Amanda
*/
const mongoColl = require("./../mongo/mongoCollections");

const expenseDB = mongoColl.expenses;
//  users: getCollectionFn("users"),
const expenseID = require("mongodb").ObjectID;
const usersFunc = require("./users.js");


//-------------------FindByParametes--------------------//
async function findByParams(name, category, amount, comment, recurring) {
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
        throw "The recurring given is not a number";
    }
    if (typeof amount !== "number") {
        throw "The amount given is not a float";
    }
    if (Number.isNaN(amount)) {
        throw "The amount given is still not a float"; //safety net cause can bypass top easily
    }
    if (Number.isNaN(recurring)) {
        throw "The recurring given is still not an INT"; //safety net cause can bypass top easily
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
//-------------------SHOULDRECURR?--------------------//
async function shouldExpRecurr(id) { //id is expenses id
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
    const possibleExp = await allExpenses.findOne({ _id: expID });
    if (possibleExp === null) {
        throw "No current expense inside with that ID"
    }
    var today = new Date();
    let cyear = today.getFullYear();
    let cmonth = today.getMonth();
    let cdate = today.getDate();
    let cday = today.getDay();

    let recurringoption = possibleExp.recurring.shouldRecurr;
    if (possibleExp.recurring.wasRecurred === 1) {
        return; //don't want to make a new one of it at all
    }
    if (recurringoption > 5 || recurringoption) {
        throw "This is an invalid recurring option ya nut"
    }
    if (recurringoption === 5) {
        console.log('No need for recurr')
        return;
    }
    let newRecChange = 0;
    if (recurringoption === 4) { //recurring yearly
        if ((cyear - possibleExp.recurring.lastTimeOccur[0]) >= 1) {
            //then yes we should recurr
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            return newRecChange;
        }
    }
    if (recurringoption === 3) { //recurring monthly
        if ((cmonth - possibleExp.recurring.lastTimeOccur[1]) >= 1) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            return newRecChange;
        }
    }
    if (recurringoption === 2) { //recurring weekly
        //need to do the newdate and math here and check
        let currentDate = new Date(cyear, cmonth, cdate);
        let recordedDate = new Date(possibleExp.recurring.shouldRecurr[0], possibleExp.recurring.shouldRecurr[1], possibleExp.recurring.shouldRecurr[2]);
        let constNumb = 1000 * 60 * 60 * 24;
        let diff = Math.abs(currentDate - recordedDate);
        let diff2 = Math.ceil(diff / constNumb)
        if (diff2 >= 7) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            return newRecChange;
        }
    }
    if (recurringoption === 1) { //recurring daily
        if ((cday - possibleExp.recurring.lastTimeOccur[3]) >= 1) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            return newRecChange;
        }
    }
    return;
}

//-------------------SHOULDRECURRWITHUSRID?--------------------//
async function shouldExpRecurrWithUsrId(id, usID) { //id is expenses id
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
    if (typeof usID === undefined) {
        throw "The id given was not of type string/can't be converted to an ObjectID";
    }
    if (typeof usID !== "string") {
        throw "A non string argument was given";
    }

    const expID = expenseID(id);
    //le usID should be a string!
    const allExpenses = await expenseDB();
    const possibleExp = await allExpenses.findOne({ _id: expID });
    if (possibleExp === null) {
        throw "No current expense inside with that ID"
    }
    var today = new Date();
    let cyear = today.getFullYear();
    let cmonth = today.getMonth();
    let cdate = today.getDate();
    let cday = today.getDay();

    let recurringoption = possibleExp.recurring.shouldRecurr;
    if (possibleExp.recurring.wasRecurred === 1) {
        return; //don't want to make a new one of it at all
    }
    if (recurringoption > 5 || recurringoption) {
        throw "This is an invalid recurring option ya nut"
    }
    if (recurringoption === 5) {
        console.log('No need for recurr')
        return possibleExp;
    }
    //helps alot with this check right here
    let newRecChange = 0;
    if (recurringoption === 4) { //recurring yearly
        if ((cyear - possibleExp.recurring.lastTimeOccur[0]) >= 1) {
            //then yes we should recurr
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            let newSameExpId = newSameExp._id;
            let userGetNewExp = await usersFunc.addExp(id, usID, recurringoption);
            return newRecChange;
        }
    }
    if (recurringoption === 3) { //recurring monthly
        if ((cmonth - possibleExp.recurring.lastTimeOccur[1]) >= 1) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            let newSameExpId = newSameExp._id;
            let userGetNewExp = await usersFunc.addExp(id, usID, recurringoption);
            return newRecChange;
        }
    }
    if (recurringoption === 2) { //recurring weekly
        //need to do the newdate and math here and check
        let currentDate = new Date(cyear, cmonth, cdate);
        let recordedDate = new Date(possibleExp.recurring.shouldRecurr[0], possibleExp.recurring.shouldRecurr[1], possibleExp.recurring.shouldRecurr[2]);
        let constNumb = 1000 * 60 * 60 * 24;
        let diff = Math.abs(currentDate - recordedDate);
        let diff2 = Math.ceil(diff / constNumb)
        if (diff2 >= 7) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            let newSameExpId = newSameExp._id;
            let userGetNewExp = await usersFunc.addExp(id, usID, recurringoption);
            return newRecChange;
        }
    }
    if (recurringoption === 1) { //recurring daily
        if ((cday - possibleExp.recurring.lastTimeOccur[3]) >= 1) {
            let newSameExp = await create(possibleExp.name, possibleExp.category, possibleExp.amount, possibleExp.comment, possibleExp.recurring.shouldRecurr); //need to make new one
            newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 1 } }); //make it marked to never be touched again during a recurring
            let newSameExpId = newSameExp._id;
            let userGetNewExp = await usersFunc.addExp(id, usID, recurringoption);
            return newRecChange;
        }
    }
    return;
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
        throw "The recurring given is not a number";
    }
    if (typeof amount !== "number") {
        throw "The amount given is not a float";
    }
    if (Number.isNaN(amount)) {
        throw "The amount given is still not a float"; //safety net cause can bypass top easily
    }
    if (Number.isNaN(recurring)) {
        throw "The recurring given is still not an INT"; //safety net cause can bypass top easily
    }
    const allExpenses = await expenseDB();

    var today = new Date();
    //var recurringTime = new Date(today.getFullYear(), today.getMonth(), today.getDay());
    var recurringTime = [today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()]
    let newExpense = {
        name: name,
        category: category,
        date: {
            year: today.getFullYear(),
            month: today.getMonth(),
            date: today.getDate(),
            day: today.getDay()
        },
        recurring: {
            shouldRecurr: recurring, //recurring value tells me if expense is recurring as not/daily/weekly/monthly/yearly
            lastTimeOccur: recurringTime,
            wasRecurred: 0
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
    //console.log(newExpense._id)
    let importantArr = [newExpense, newExpense._id, recurring]; //I want this to pass the expense ID and recurring number for user function ot be called next
    return importantArr; //??? dont need it but for debugging
}

//-------------------UPDATE--------------------//
async function update(id, nname, ncategory, namount, ncomment, nrecurring) {
    //make expense
    //Should just recieve name of the expense or recieving id?
    if (arguments.length > 6) {
        throw "The amount of arguments given was more than 6";
    }
    if (arguments.length < 6) {
        throw "The number of arguments given was less than 6";
    }
    if (typeof id === undefined) {
        throw "The id given was not of type string/can't be converted to an ObjectID";
    }
    if (typeof id !== "string") {
        throw "A non string argument was given";
    }
    //if type of argument is not null or not a string
    if (typeof nname !== 'string') {
        if (typeof nname !== "object") {
            throw "Arg2 missing"
        }
    }
    if (typeof ncategory !== 'string') {
        if (typeof ncategory !== "object") {
            throw "Arg3 missing"
        }
    }
    if (typeof namount !== 'number') {
        if (typeof namount !== "object") {
            throw "Arg4 missing"
        }
    }
    if (typeof ncomment !== 'string') {
        if (typeof ncomment !== "object") {
            throw "Arg5 missing"
        }
    }

    if (typeof nrecurring !== 'number') {
        if (typeof nrecurring !== "object") {
            throw "Arg6 missing"
        }
    }
    //inside mongo is just string so i'm pretty sure amount and recurring should be string

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
        const newNameChange = await allExpenses.updateOne({ _id: expID }, { $set: { name: nname } });
    }
    //if wanna change the category
    if (ncategory !== possibleExp.category && ncategory !== null) {
        //then name got change
        const newCatChange = await allExpenses.updateOne({ _id: expID }, { $set: { category: ncategory } });
    }
    //if wanna change recurring status
    //console.log(possibleExp)
    if (
        nrecurring !== possibleExp.recurring.shouldRecurr && nrecurring !== null) {
        //then name got change
        const newRecChange = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.shouldRecurr": nrecurring } });
        const newRecChange2 = await allExpenses.updateOne({ _id: expID }, { $set: { "recurring.wasRecurred": 0 } });
    }
    //if wanna change amount
    if (namount !== possibleExp.amount && namount !== null) {
        //then name got change
        const newAmtChange = await allExpenses.updateOne({ _id: expID }, { $set: { amount: namount } });
    }
    //if wanna change comment/description
    if (ncomment !== possibleExp.amount && ncomment !== null) {
        //then name got change
        const newComChange = await allExpenses.updateOne({ _id: expID }, { $set: { comment: ncomment } });
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
    const possibleExp = await allExpenses.findOne({ _id: expID });
    if (possibleExp === null) {
        throw "No current expense inside with that ID"
    }
    const yoinkedExp = await allExpenses.removeOne({ _id: expID });
    if (yoinkedExp.deletedCount === 0) {
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
    if (arguments.length < 1) {
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
    findByParams,
    shouldExpRecurrWithUsrId,
    shouldExpRecurr,
    create,
    Remove,
    update,
    get,
    getAll
};
