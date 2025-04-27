const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;
let mongo = null;

async function startDatabase() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  const connection = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = connection.db();
  console.log("In-memory MongoDB started.");
}

async function getDatabase() {
  if (!database) {
    throw new Error('Database not started yet. Call startDatabase() first.');
  }
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
