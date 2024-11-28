const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

exports.database = client.db(process.env.MONGO_DB_NAME);

exports.connectDatabase = async () => {
  try {
    await client.connect();
    console.log('Conexão estabelecida com sucesso!');
  } catch (error) {
    console.error(err.message);
  }
};
