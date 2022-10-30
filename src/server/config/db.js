const mysql = require('mysql2')
const db = mysql.createConnection({
    host: "localhost",
    user: "majd_kontar",
    password: "majd1408",
    database:"election_schema"
})

module.exports = db;
