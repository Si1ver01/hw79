const mysql = require("mysql2/promise");

let connection = null;

const main = async () => {
  // get the client
  // create the connection
  connection = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "123",
    database: "inventory"
  });
};

module.exports = { connection: () => connection, main };
