const { Client } = require("pg");

let client = null;

module.exports.getClient = async () => {
  let currentClient = client;
  if (!currentClient) {
    client = new Client({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "webbuilder",
      ssl: false,
    });
    client.connect();
    currentClient = client;
  }
  return currentClient;
};
