const mysql = require('mysql2')
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "majd_kontar",
//     password: "majd1408",
//     database:"election_schema"
// })
const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database:"student_elections"
})

module.exports = db, {jwtSecret:process.env.JWT_SECRET }
