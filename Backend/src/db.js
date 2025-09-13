const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',         // replace with your MySQL username
	password: '8432513435Ritesh', // replace with your MySQL password
	database: 'store_rating_app'
});

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to MySQL:', err);
		return;
	}
	console.log('Connected to MySQL database!');
});

module.exports = connection;