const express = require('express');
const db = require('./config/db')
const cors = require('cors')

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json())

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM student WHERE studentUsername=? AND studentPassword=?",
        [username, password], (err, result) => {
            if (err) {
                console.log(err)
                res.send({'ERROR': err});
            }
            res.send({'Result': result});
        });
})

app.put('/register', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const school = req.body.school;
    const major = req.body.major;
    const cls = req.body.cls;
    const campus = req.body.campus;
    const address = req.body.address;
    const phone = req.body.phoneNb;
    const username = req.body.username;
    const studentEmail = req.body.studentEmail;
    const password = req.body.studentPassword;
    const studentRecoveryEmail = req.body.studentRecoveryEmail;

    let values = [firstName, lastName, school, major, cls, campus, address, phone, username, studentEmail, password, studentRecoveryEmail]
    db.query("SELECT * FROM student WHERE studentUsername=?", [username], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        if (result.length > 0) {
            console.log("Username already exists");
            res.send({'ERROR': "Username already exists"});
        } else {
            db.query("INSERT INTO student(firstName, lastName, school, major, class, campus, address, phoneNb, studentUsername,studentEmail, studentPassword, studentRecoveryEmail) VALUES (?)",
                [values],
                (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send({'ERROR': err});
                    }
                    res.send({'Result': result});
                });
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})