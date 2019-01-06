/**
 * This file connects to the mysql DB that the platform will be using.
 */
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "javawebappdb"
});

connection.connect(function(err) {
	if(err) throw err;
	console.log("Database is connected!");
})

module.exports = connection;