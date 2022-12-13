const express = require('express');
const db = require('../config/configs')
const cors = require('cors')

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {createJWT, autheticateJWT, isAdmin} = require('./JWT');

const{ check, validationResult } = require('express-validator'); 
const { redirect } = require('react-router-dom');
const { JsonWebToken } = require('jsonwebtoken');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json()); 
app.use(cookieParser()); 

db.connect(function(err) {
    if (err) throw err; 
    console.log("Connected to MySQL!")
});

app.post('/register', [
    //input validations
    check("studentId", "Input a Valid Student ID").isNumeric(), 
    check("username", "Choose your username").notEmpty(),
    check("studentEmail", "Please enter a valid email").isEmail(),
    check("studentRecoveryEmail", "Please enter a valid email").isEmail(),
    check("studentPassword", "Please choose a password with at least 8 characters").isLength({min:8})


], (req, res) => {

    const { studentId, username, studentPassword, studentEmail, studentRecoveryEmail } = req.body; 
    
    const errors = validationResult(req); //array that contains errors from validator

    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()}); 
    }
    //validate that user doesn't already exits

    db.query("SELECT * FROM student_register WHERE username=?", [username], (err, result) => {
        if (result.length>0) {
            console.log(result)
            res.status(422).json({'ERROR': "Username already exists"});
            return('/register')
        }
    });
    // db.query("SELECT * FROM student_register WHERE studentEmail=?", [studentEmail], (err, result) => {
    //     if (result.length>0) {
    //         console.log(result)
    //         res.status(422).json({'ERROR': "This email is already in use, please enter a different email. "});
    //         return('/register')
    //     }
    // });
    // db.query("SELECT * FROM student_register WHERE studentRecoveryEmail=?", [studentRecoveryEmail], (err, result) => {
    //     if (result.length>0) {
    //         console.log(result)
    //         res.status(422).json({'ERROR': "This email is already in use, please enter a different email. "});
    //         return('/register')
    //     };
    // });
    //hash password before saving it into DB
    const hashed_password = bcrypt.hash(studentPassword, 8).then((hashed_password => {

        let values = [studentId, username, studentEmail, hashed_password, studentRecoveryEmail]

        db.query("INSERT INTO student_register(studentId, username, studentEmail, studentPassword, studentRecoveryEmail) VALUES (?)",
            [values],
            (err, result) => {
                if (err) {
                    res.status(400).json({'ERROR': err}); 
                    return('/register')

                }
                message = "Registration Successful!"
                res.status(200).json([{'Message': message}, {'Result':result}]);
            });
        }))
    });


app.get('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.studentPassword;
    
    //login will be based on username
    db.query("SELECT * FROM student_register WHERE username=?",[username], (err, result) => {

            if (result.length == 0){
                message = "Oops! User Doesn't Exist"; 
                res.status(404).json({'Error': message}); 
                return('/login')
            } 

            const db_user = JSON.parse(JSON.stringify(result[0])); 

            const db_pass = db_user.studentPassword; 
            const stdId = db_user.studentId; 

            //check is user inputted password matches saved password
            bcrypt.compare(password, db_pass).then((match) => {
                if (!match){
                    message = "Invalid Credentials."
                    res.status(403).json({'Error': message}); 
                }
                else {
                    //if they match, create and send JWT
                    accessToken = createJWT(stdId);
                    res.cookie("access-token", accessToken, {
                        maxAge: 2592000,
                        httpOnly: true
                    });

                    message = "Successfully Logged In!"; 
                    // res.status(200).json({'Message': message});
                    res.redirect('/profile');
                }

            }); 
        })
});
app.get('/admin-login', (req, res) => {
    const username = req.body.adminUsername;
    const password = req.body.adminPassword;
    
    //login will be based on username
    db.query("SELECT * FROM admin WHERE adminUsername=?",[adminUsername], (err, result) => {

            if (result.length == 0){
                message = "Oops! Not an Admin"; 
                res.status(404).json({'Error': message}); 
                return('/login')
            } 

            const db_user = JSON.parse(JSON.stringify(result[0])); 

            const db_pass = db_user.adminPassword; 

            //check is user inputted password matches saved password
            bcrypt.compare(password, db_pass).then((match) => {
                if (!match){
                    message = "Invalid Credentials."
                    res.status(403).json({'Error': message}); 
                }
                else {
                    //if they match, create and send JWT
                    accessToken = createJWT(stdId);
                    res.cookie("access-token", accessToken, {
                        maxAge: 2592000,
                        httpOnly: true
                    });

                    message = "Successfully Logged In!"; 
                    res.redirect('/profile');
                }

            }); 
        })
});

app.get('/profile', autheticateJWT, (req,res) => {
    const studentId = req.body.studentId; 
    if (autheticateJWT){
        db.query("SELECT * FROM student WHERE studentId=?",[studentId], (err, result) => {
            
        })
    }else{
        res.send("log in to view the page")
    }res.end()

})


app.get('/logout', (req, res) => {
    res.cookie("access-token",null);
    res.redirect('/login')
  })



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
    })