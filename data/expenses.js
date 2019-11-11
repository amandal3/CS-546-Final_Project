const mongoColl = require("./../mongo/mongoCollections");
const usersDB = mongoColl.users;
//  users: getCollectionFn("users"),
const userID = require('mongodb').ObjectID;

async function create(name, animalType){
	if (arguments.length > 2){
    throw "More than 2 arguments were given"
  }
  if (arguments.length < 2){
    throw "Less than 2 arguments were given"
  }
	if (typeof name === undefined){
    throw "Name argument is undefined"
  }
  if (typeof animalType === undefined){
    throw "animalType argument is undefined"
  }
  if (typeof name !== 'string'){
    throw "The name given is not a string"
  }
  if (typeof animalType !== 'string'){
    throw "The animalType argument given is not a string"
  }
	const pokeSquad = await pokemon();
	let newPoke = {
		name: name,
		animalType: animalType,
		likes: [], //new
		posts: [] //new
	};
	await pokeSquad.insertOne(newPoke);
	if (pokeSquad.insertedCount === 0){
    throw "We couldn't add that animal (pokemon)"
  }
	const newpokeId = pokeSquad.insertedId;
	return newPoke;
}
