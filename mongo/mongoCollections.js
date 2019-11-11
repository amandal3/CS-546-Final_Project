//Don't need index file if we will just refer to this one file here
//Currently only need to reference it for DB finding
const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
  let _col = undefined;
  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

module.exports = {
  users: getCollectionFn("users"),
  expenses: getCollectionFn("expenses")
};
