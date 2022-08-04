const {Pool, Client} = require('pg');
const connectionString = "postgresql://username:password@127.0.0.1:5432/default_database";

const client = new Client({
    connectionString,

});

client.connect();
module.exports = client;
