// mysql dependency
const mysql = require('mysql2');
// dotenv to read env file
require('dotenv').config();

const sequelize = mysql.createConnection(
  {
    host: 'localhost',
    user:   process.env.DB_USER,
    password:   process.env.DB_PASSWORD,
    database:   process.env.DB_NAME,
    port: 3306
  }
);

module.exports = sequelize;