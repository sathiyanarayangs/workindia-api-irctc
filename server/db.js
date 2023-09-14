const mysql = require('mysql');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'my_db',
  password: '2010',
  database: 'irctc',
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.message);
    return;
  }
  console.log('Connected to the database');
});


module.exports = db;
