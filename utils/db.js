const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12786574',
  password: 'KEpFiKrtBH',
  database: 'sql12786574',
});



module.exports = db;
