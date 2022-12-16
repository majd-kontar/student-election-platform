const express = require('express');
const db = require('../config/configs')
const cors = require('cors')

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {createJWT, autheticateJWT, isAdmin} = require('./JWT');

const {check, validationResult} = require('express-validator');
const {redirect} = require('react-router-dom');
const {JsonWebToken} = require('jsonwebtoken');
const app = express();
const PORT = 3002;

app.use(cors({
    origin: '*',
    exposedHeaders: 'access-token',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!")
});


app.post('/register', [
    //input validations
    check("firstName", "Input your first name").notEmpty(),
    check("lastName", "Input your last name").notEmpty(),
    check("studentUsername", "Choose your username").notEmpty(),
    check("studentEmail", "Please enter a valid email").isEmail(),
    check("studentPassword", "Please choose a password with at least 8 characters").isLength({min: 8})


], (req, res) => {
    const {firstName, lastName, studentUsername, studentEmail, studentPassword} = req.body;
    const errors = validationResult(req); //array that contains errors from validator

    if (!errors.isEmpty()) {
        return res.status(400).json({Errors: errors.array()});
    }
    //validate that user doesn't already exits

    db.query("SELECT * FROM student WHERE studentUsername=?", [studentUsername], (err, result) => {
        if (result.length > 0) {
            console.log(result)
            return res.status(422).json({'Error': "Username already exists"});
        }
        //hash password before saving it into DB
        const hashed_password = bcrypt.hash(studentPassword, 8).then((hashed_password => {

            let values = [firstName, lastName, studentUsername, studentEmail, hashed_password]
            db.query("INSERT INTO student(firstname, lastname, studentUsername, studentEmail, studentPassword) VALUES (?)",
                [values],
                (err, result) => {
                    console.log('here(');
                    if (err) {
                        console.log(err);
                        return res.status(400).json({'Error': err});
                    }
                    message = "Registration Successful!"
                    res.status(200).json([{'Message': message}, {'Result': result}]);
                });
        }))
    });
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


app.patch('/updateProfile', [
    //input validations
    check("firstName", "Input your first name").notEmpty(),
    check("lastName", "Input your last name").notEmpty(),
    check("username", "Choose your username").notEmpty(),
    check("studentEmail", "Please enter a valid email").isEmail(),
    check("studentPassword", "Please choose a password with at least 8 characters").isLength({min: 8})


], (req, res) => {
    console.log(req.body)
    const {firstName, lastName, username, studentEmail, studentPassword} = req.body;
    console.log(req.body);
    const errors = validationResult(req); //array that contains errors from validator

    if (!errors.isEmpty()) {
        return res.status(400).json({Errors: errors.array()});
    }
        //hash password before saving it into DB
        const hashed_password = bcrypt.hash(studentPassword, 8).then((hashed_password => {

            let values = [firstName, lastName, username, studentEmail, hashed_password]
            db.query(`UPDATE student SET VALUES (firstName,lastName,studentUsername,studentEmail, studentPassword) WHERE studentUsername = ${username}`,
                [values],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({'Error': err});
                    }
                    console.log(result)
                    message = "Profile updated successfully!"
                    res.status(200).json([{'Message': message}, {'Result': result}]);
                });
        }))
    });
app.post('/admin_set_password', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 

    const hashed_password = bcrypt.hash(password, 8).then((hashed_password =>{
        db.query("UPDATE admin SET adminPassword=? WHERE adminUsername=?" , [hashed_password, username] ,(err,result) =>{
            if (err) {
                console.log(err); 
                return res.status(400).json({'Error': err}); 
            }
            console.log(hashed_password);
            message = "Password updated successfully!"; 
            res.status(200).json({'Message': message}); 
    
        });
    }));
  
})

app.get('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //login will be based on username
    db.query("SELECT * FROM student WHERE studentUsername=?", [username], (err, result) => {
        if (result.length == 0) {
            db.query("SELECT * FROM admin WHERE adminUsername=?", [username], (err, result1) =>{
                if (result1.length > 0){
                    console.log(result1)
                    const db_user = JSON.parse(JSON.stringify(result1[0]));
                   
                    const db_pass = db_user.adminPassword;
                    const adId = db_user.adminUsername;
                    //check if user inputted password matches saved password
                    bcrypt.compare(password, db_pass).then((match) => {
                        
                        if (!match) {
                            message = "Invalid Credentials."
                            res.status(403).json({'Error': message});
                        } else {
                            //if they match, create and send JWT
                            accessToken = createJWT(adId, true);
                            message = "Successfully Logged In!";
                            res.writeHead(200, {"access-token": accessToken});
                            res.end(message);
                        }
                    })
                }else{
                message = "Oops! User Doesn't Exist";
                res.status(404).json({'Error': message});
                return ('/login') 
                } })
        }else if (result.length >0) {
            
            const db_user = JSON.parse(JSON.stringify(result[0]));
            
            const db_pass = db_user.studentPassword;
            const stdId = db_user.studentUsername;
    
            //check if user inputted password matches saved password
            bcrypt.compare(password, db_pass).then((match) => {
                if (!match) {
                    message = "Invalid Credentials."
                    res.status(403).json({'Error': message});
                } else {
                    //if they match, create and send JWT
                    accessToken = createJWT(stdId, false);
                    message = "Successfully Logged In!";
                    res.writeHead(200, {"access-token": accessToken});
                    res.end(message);
                    // {
                    // maxAge: 2592000,
                    // // httpOnly: false,
                    // secure: true,
                    // sameSite: 'none',
                    // });
                    // res.status(200).json({'Message': message});
                    // res.redirect('/profile');
                }
    
            });
        }});
    });
        
app.get('/profile', autheticateJWT, (req, res) => {
    const studentId = req.body.studentId;
    console.log(studentId)
    if (autheticateJWT) {
        db.query("SELECT * FROM student WHERE studentUsername=?", [studentId], (err, result) => {

        })
    } else {
        res.send("log in to view the page")
    }
    res.end()

})

app.get('/getElections', autheticateJWT, (req, res) => {
    if (autheticateJWT) {
        db.query("SELECT * FROM elections", [studentId], (err, result) => {

        })
        res.send(results);
    } else {
        res.send("log in to view the page")
    }
    res.end()

});

app.get('/getElectionsById', autheticateJWT, (req, res) => {
    const id = req.body.id;
    if (autheticateJWT) {
        db.query("SELECT * FROM elections WHERE electionID = " + id, [studentId], (err, result) => {

        })
        res.send(results);
    } else {
        res.send("log in to view the page")
    }
    res.end()

});

app.get('/logout', (req, res) => {
    res.cookie("access-token", null);
    res.redirect('/login')
})


app.listen(PORT, (err) => {
    if (err)
        throw err;
    console.log('listening on port 3002');
});
