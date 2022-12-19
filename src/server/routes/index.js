const express = require('express');
const db = require('../config/configs')
const cors = require('cors')
const UUID = require('uuid');
const jwt_decode = require('jwt-decode');
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
    check("username", "Choose your username").notEmpty(),
    check("studentEmail", "Please enter a valid email").isEmail(),
    check("studentPassword", "Please choose a password with at least 8 characters").isLength({min: 8})


], (req, res) => {
    console.log(req.body)
    const {firstName, lastName, username, studentEmail, studentPassword} = req.body;

    const errors = validationResult(req); //array that contains errors from validator

    if (!errors.isEmpty()) {
        return res.status(400).json({Errors: errors.array()});
    }
    //validate that user doesn't already exits

    db.query("SELECT * FROM student WHERE studentUsername=?", [username], (err, result) => {
        if (result.length > 0) {
            console.log(result)
            return res.status(422).json({'Error': "Username already exists"});
        }
        const hashed_password = bcrypt.hash(studentPassword, 8).then((hashed_password => {

            let values = [firstName, lastName, username, studentEmail, hashed_password]

            db.query("INSERT INTO student(firstName,lastName,studentUsername,studentEmail, studentPassword) VALUES (?)",
                [values],
                (err, result) => {
                    if (err) {
                        return res.status(400).json({'Error': err});
                    }
                    message = "Registration Successful!"
                    res.status(200).json([{'message': message}, {'Result': result}]);
                });
        }))
    });
});

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
        db.query(`UPDATE student
                  SET VALUES(firstName, lastName, studentUsername, studentEmail, studentPassword)
                  WHERE studentUsername = ${username}`,
            [values],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({'Error': err});
                }
                console.log(result)
                message = "Profile updated successfully!"
                res.status(200).json([{'message': message}, {'Result': result}]);
            });
    }))
});
app.post('/admin_set_password', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username)


    const hashed_password = bcrypt.hash(password, 8).then((hashed_password => {
        db.query("UPDATE admin SET adminPassword=? WHERE adminUsername=?", [hashed_password, username], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({'Error': err});
            }
            console.log(result);
            message = "Password updated successfully!";
            res.status(200).json({'message': message});
        });
    }));

})


app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    //login will be based on username
    db.query("SELECT * FROM student WHERE studentUsername=?", [username], (err, result) => {
        if (result.length === 0) {
            db.query("SELECT * FROM admin WHERE adminUsername=?", [username], (err, result) => {
                if (result.length > 0) {

                    const db_user = JSON.parse(JSON.stringify(result[0]));

                    const db_pass = db_user.adminPassword;
                    const adId = db_user.adminUsername;

                    //check if user inputted password matches saved password
                    bcrypt.compare(password, db_pass).then((match) => {
                        if (!match) {
                            console.log(db_pass, password)
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
                } else {
                    message = "Oops! User Doesn't Exist";
                    res.status(404).json({'Error': message});
                    return ('/login')
                }
            })
        } else if (result.length > 0) {

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
                }

            });
        }
    });
});

app.get('/admin-login', (req, res) => {
    const username = req.body.adminUsername;
    const password = req.body.adminPassword;

    //login will be based on username
    db.query("SELECT * FROM admin WHERE adminUsername=?", [username], (err, result) => {

        if (result.length == 0) {
            message = "Oops! Not an Admin";
            res.status(404).json({'Error': message});
            return ('/login')
        }

        const db_user = JSON.parse(JSON.stringify(result[0]));

        const db_pass = db_user.adminPassword;
        const aId = db_user.adminUsername
        //check is user inputted password matches saved password
        bcrypt.compare(password, db_pass).then((match) => {
            console.log(match)
            if (!match) {
                message = "Invalid Credentials."
                res.status(403).json({'Error': message});
            } else {
                //if they match, create and send JWT
                accessToken = createJWT(aId, true);
                message = "Successfully Logged In!";
                res.writeHead(200, {"access-token": accessToken});
                res.end(message);
                // res.cookie("access-token", accessToken, {
                //     maxAge: 2592000,
                //     httpOnly: true
                // });

                message = "Successfully Logged In!";
                res.redirect('/profile');
            }

        });
    })
});

app.get('/profile', autheticateJWT, (req, res) => {
    let studentId = jwt_decode(cookies['access-token'])['id']
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

app.post('/create_election', (req, res) => {
    const {type, campus, club, major, endDate, cookies} = req.body;
    const electionID = UUID.v4();
    const electionDate = new Date();
    const electionYear = electionDate.getFullYear();

    let election_values = [electionID, electionDate.toDateString(), campus, new Date(endDate)]
    let isAdmin = jwt_decode(cookies['access-token'])['admin']

    if (isAdmin) {

        db.query("INSERT INTO election VALUES(?)", [election_values], (err, result_E) => {
            if (err) {
                console.log(err);
                return res.status(400, {"Error": err});
            }

            if (type == "Club") {
                db.query("SELECT * FROM club WHERE clubElectionYear = ? AND clubName =? AND clubElectionID IS NOT NULL", [electionYear, club], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400, {"Error": err});
                    }
                    if (result.length > 0) {
                        res.status(400, {"Error": "Election alreay created."});
                    } else {
                        db.query("UPDATE club SET clubElectionId =?, clubElectionYear=? WHERE clubName=?", [electionID, electionYear, club], (err, result1) => {
                            console.log(result1)
                            if (err) {
                                console.log(err);
                                res.status(400, {"Error": err});
                            }
                        })
                    }
                })
            }

            if (type == "Representative") {
                db.query("SELECT * FROM rep_election_results WHERE repMajor =? AND repCampus =? AND repElectionYear =? ", [major, campus, electionYear], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400, {"Error": err});
                    }
                    if (result.length > 0) {
                        res.status(400, {"Error": "Election alreay created."});
                    } else {
                        db.query("INSERT INTO rep_election_results(repElectionID, electionID_FK, repMajor, repCampus, repElectionYear) VALUES (?,?,?,?,?)", [0, electionID, major, campus, electionYear], (err, result) => {
                            console.log(result)
                            if (err) {
                                console.log(err);
                                res.status(400, {"Error": err});
                            }
                        })
                    }

                })
            } else if (type == "Council") {
                db.query("SELECT * FROM council_election_results WHERE councilElectionCampus =? AND councilElectionYear=?", [campus, electionYear], (err, result) => {
                    console.log(result)
                    if (err) {
                        console.log(err);
                        res.status(400, {"Error": err});
                    }
                    if (result.length > 0) {
                        res.status(400, {"Error": "Election alreay created."});
                    } else {
                        db.query("INSERT INTO council_election_results(councilElectionID, electionID_COUNCIL_FK, councilElectionCampus, councilElectionYear) VALUES (?,?,?,?)", [0, electionID, campus, electionYear], (err, result) => {
                            console.log(result)
                            if (err) {
                                console.log(err);
                                res.status(400, {"Error": err});
                            }
                        })
                    }
                })
            }

            message = "Election Created Successfully!"
            res.status(200).send({'message': message});
        })
    } else {
        res.status(403).send({'Error': 'Unauthorized! Not an Admin'})
    }
});

app.post('/submit_candidate_form', (req, res) => {
    let electionID = req.body['electionID'];
    let electoralProgram = req.body.electoralProgram;
    let electionPosition = req.body.electionPosition;
    let cookies = req.body.cookies;
    let submissiondate = new Date()
    const studentUsername = jwt_decode(cookies['access-token'])['id']
    const formID = UUID.v4();

    let election_form = [studentUsername, electionID.toString(), formID.toString(), submissiondate];


    //check if user has already submitted a form for an election this year

    db.query("SELECT * FROM student_election_form WHERE studentUsername_FK=? AND electionID = ?", [studentUsername, electionID.toString()], (err, result) => {
        if (result.length > 0) {
            res.send({'ERROR': "Form was already submitted!"});
        } else {
            db.query("INSERT INTO candidate_form(formID, electionPosition, electoralProgram) VALUES (?,?,?) ", [formID.toString(), electionPosition, electoralProgram], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'ERROR': err});
                } else {
                    db.query("INSERT INTO student_election_form VALUES (?)", [election_form], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send({'ERROR': err});
                        } else
                            res.send({'message': 'Candidate Form Successfully Submitted!'})
                    })
                }
            })
        }
    })
})
app.get('/get_elections', (req, res) => {
    var clubs = '';
    var representatives = '';
    var councils = '';
    db.query("select electionID As ID,clubName AS 'Name',clubDescription As 'Description',electionCampus AS 'Campus',electionEndTime AS 'Election Countdown' from club,election where clubElectionID=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        clubs = result;
    });
    db.query("select electionID As ID,electionCampus AS 'Campus',electionEndTime AS 'Election Countdown' from council_election_results,election where council_election_results.electionID_COUNCIL_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        councils = result
    });
    db.query("select electionID As ID,repMajor AS Major, repSchool As School, repCampus AS Campus, electionEndTime AS 'Election Countdown' from rep_election_results,election where rep_election_results.electionID_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        representatives = result
        res.send({
            'Result': {
                'Clubs': clubs,
                'Councils': councils,
                'Representatives': representatives
            }
        });
    });

})
app.get('/accept_form', (req, res) => {
    let output = 'Done';
    let formId = req.query.formId;
    db.query("UPDATE candidate_form SET status=1 WHERE formID=?", [formId], (err) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});
app.get('/reject_form', (req, res) => {
    let output = '';
    let formId = req.query.formId;
    db.query("UPDATE candidate_form SET status=0 WHERE formID=?", [formId], (err) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});
app.get('/get_candidates_by_election_id', (req, res) => {
    let output = '';
    let electionId = req.query.electionID;
    db.query("SELECT CONCAT(firstName,' ',lastName)as name,electionPosition,electoralProgram,studentUsername FROM election,student_election_form,candidate_form,student where election.electionID=student_election_form.electionID and candidate_form.formID=student_election_form.formID and status=1 and studentUsername=student_election_form.studentUsername_FK and student_election_form.electionID=(?)", [electionId], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        output = result;
        // console.log(result)
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});
app.post('/submit_vote_form', (req, res) => {
    let output = '';
    let electionId = req.body.electionId;
    let cookies = req.body.cookies;
    let studentCandidateId = req.body.vote
    const studentId = jwt_decode(cookies['access-token'])['id']
    db.query("Select * From vote where studentVoterID=? and electionID__FK=?", [studentId, electionId], (err, result) => {
            if (err) {
                console.log(err)
                res.send({'Error': err});
            } else if (result.length > 0) {
                console.log('You already voted!')
                res.send({'message': 'You already voted!'})

            } else {
                db.query("INSERT INTO vote(studentVoterID,studentCandidateID,electionID__FK,voteTime) VALUES (?)", [[studentId, studentCandidateId, electionId, new Date()]], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send({'ERROR': err});
                        } else {
                            res.send({'message': 'Vote Form Successfully Submitted!'})

                        }
                    }
                )
            }
        }
    )

})
;

app.post('/submit_candidate_form', (req, res) => {
    let electionID = req.body.electionID;
    let electoralProgram = req.body.program;
    let electionPosition = req.body.position;
    let cookies = req.body.cookies;
    let submissiondate = new Date()


    const studentUsername = jwt_decode(cookies['access-token'])['id']
    const formID = UUID.v4();

    let election_form = [studentUsername, electionID.toString(), formID.toString(), submissiondate];


    //check if user has already submitted a form for an election this year
    db.query("SELECT * FROM student_election_form WHERE studentUsername_FK=? AND submissionDate LIKE '?%'", [studentUsername, submissiondate.getFullYear()], (err, result) => {
        if (result.length > 0) {
            console.log(result)
            return res.status(422).json({'Error': "Form was already submitted!"});
        } else {
            db.query("INSERT INTO candidate_form(formID, electionPosition, electoralProgram,adminUsername) VALUES (?,?,?,?) ", [formID.toString(), electionPosition, electoralProgram, 'majd-kontar'], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'Error': err});
                } else {
                    db.query("INSERT INTO student_election_form VALUES (?)", [election_form], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send({'Error': err});
                        } else
                            res.send({'message': 'Candidate Form Successfully Submitted!'})
                    })
                }
            })
        }
    })
})
app.get('/get_elections_by_id', (req, res) => {
    var clubs = '';
    var representatives = '';
    var councils = '';
    var student_id = req.body.student_id;
    db.query("select * from club,election,student_club where clubElectionID=election.electionID AND student_club.clubID=club.clubID AND student_club.studentUsername='%s'", student_id, (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err});
        }
        clubs = result;
    });
    db.query("select * from council_election_results,election where council_election_results.electionID_COUNCIL_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err});
        }
        councils = result
    });
    db.query("select * from rep_election_results,election where rep_election_results.electionID_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err});
        }
        representatives = result
        res.send({
            'Result': {
                'Clubs': clubs,
                'Councils': councils,
                'Representatives': representatives
            },
            'token': '08508fa0sf8as'
        });
    });
})
app.get('/get_requests', (req, res) => {
    let output = '';
    db.query("select candidate_form.formID AS 'Form ID', electionID AS 'Election ID',submissionDate AS 'Submission Date',CONCAT(firstName,' ',lastName)AS Name, school AS School, major AS Major, class AS Class, campus AS Campus, phoneNb AS 'Phone Number'from candidate_form,student_election_form,student where candidate_form.formID=student_election_form.formID AND student_election_form.studentUsername_FK=student.studentUsername AND candidate_form.status IS NULL", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err});
        }
        output = result;
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});
app.get('/get_requests_by_id', (req, res) => {
    let cookies = req.query.cookies;
    const studentUsername = jwt_decode(cookies['access-token'])['id']

    let output = '';
    db.query("select candidate_form.formID AS 'Form ID', electionID AS 'Election ID',submissionDate AS 'Submission Date',CONCAT(firstName,' ',lastName)AS Name, school AS School, major AS Major, class AS Class, campus AS Campus, phoneNb AS 'Phone Number'from candidate_form,student_election_form,student where candidate_form.formID=student_election_form.formID AND student_election_form.studentUsername_FK=student.studentUsername AND candidate_form.status IS NULL AND studentUsername=?", [studentUsername], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err});
        }
        output = result;
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});


app.get('/logout', (req, res) => {
    res.cookie("access-token", null);
    res.redirect('/login')
})
app.post('/create_club', (req, res) => {
    const {clubName, clubDescription} = req.body;

    let values = [0, clubName, clubType, clubDescription]
    db.query("SELECT * FROM club WHERE clubName=?", [clubName], (err, result) => {
        if (result.length > 0) {
            console.log(result)
            return res.status(422).json({'Error': "Club already exists"});
        } else {
            db.query("INSERT INTO club(clubName, clubDescription) VALUES (?)", [values], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'Error': err})
                }
                res.send({'message': 'Club Successfully Created!'})
            })
        }
    })
})
app.post('/update_club_information', (req, res) => {
    const {
        clubName,
        clubDescription,
        president,
        vicePresident,
        secretary,
        treasurer,
        clubElectionYear,
        clubElectionID
    } = req.body;

    db.query("UPDATE club SET clubDescription=?, president=?, vicePresident=?, secretary=?, treasurer=?, clubElectionYear=?, clubElectionID=? WHERE clubName=?",
        [clubDescription, president, vicePresident, secretary, treasurer, clubElectionYear, clubElectionID, clubName], (err, result) => {
            if (err) {
                console.log(err)
                res.send({'Error': err})
            }
            res.send({'message': 'Club successfully updated!'})
        })
})
app.get('/get_clubs', (req, res) => {

    db.query("SELECT * FROM club", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err})
        }
        res.send({"Clubs": result})
    })
})

app.post('/register_student_in_club', (req, res) => {
    const {clubName, cookies} = req.body;

    const studentUsername = jwt_decode(cookies)['id']

    let values = [0, studentUsername, clubName]

    db.query("SELECT * FROM student_club WHERE studentUsername =? AND clubName =?", [studentUsername, clubName], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err})
        }
        if (result.length > 0) {
            res.send({'Error': 'Student Already Registered in Club!'})

        } else {
            db.query("INSERT INTO student_club VALUES (?)", [values], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'Error': err})
                }
                res.send({'message': 'Successfully Registered in Club!'})

            })
        }
    })
})


app.get('/get_students_in_club', (req, res) => {

    const clubName = req.body.clubName;

    db.query("SELECT * FROM student_club,student WHERE student_club.studentUsername = student.studentUsername AND student_club.clubName =?",
        [clubName], (err, result) => {
            console.log(result)
            if (err) {
                console.log(err);
                res.send({'Error': err})
            }
            res.send({"Students in Club": result})
        })


})
app.get('/get_students_in_club_by_id', (req, res) => {
    const clubName = req.body.clubName;
    const cookies = req.body.cookies;

    let studentUsername = jwt_decode(cookies)['id']
    db.query("SELECT * FROM student_club,student WHERE student_club.studentUsername = student.studentUsername AND student_club.clubName =? AND student_club.studentUsername =?",
        [clubName, studentUsername], (err, result) => {
            console.log(result)
            if (err) {
                console.log(err);
                res.send({'Error': err})
            }
            res.send({"Student in Club": result})
        })

})


app.post('/remove_student_from_club', (req, res) => {
    const {clubName, cookies} = req.body;

    let studentUsername = jwt_decode(cookies)['id']
    db.query("DELETE FROM student_club WHERE studentUsername =? AND clubName =?", [studentUsername, clubName], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"Student Removed from Club": result})
    })


})
app.get('/get_club_candidates_by_position', (req, res) => {
    const {clubName, position} = req.body;

    db.query("SELECT firstName, lastName, S.studentUsername, electoralProgram from candidate_form C, student_election_form SE, student S, student_club SC, club\
        WHERE  SC.studentUsername = S.studentUsername AND C.formID = SE.formID AND SE.electionID = club.clubElectionID \
        AND club.clubName = ? AND C.electionPosition =? AND C.status=1", [clubName, position], (err, result) => {


        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"club election candidates by position": result})
    })

})
app.get('/get_club_candidates_by_position_by_election_id', (req, res) => {
    const {clubName, position, electionID} = req.body;

    db.query("SELECT firstName, lastName, S.studentUsername, electoralProgram from candidate_form C, student_election_form SE, student S, student_club SC, club\
        WHERE  SC.studentUsername = S.studentUsername AND C.formID = SE.formID AND SE.electionID = club.clubElectionID \
        AND club.clubName = ? AND C.electionPosition =? AND C.status=1 AND club.ElectionID =?", [clubName, position, electionID], (err, result) => {


        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"club election candidates by position": result})
    })

})
app.get('/get_votes_by_election_id', (req, res) => {

    const electionID = req.body;

    db.query("SELECT COUNT(*) AS TotalVotes FROM vote WHERE electionID=?", [electionID], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"Total Votes in Election": result})
    })
})
app.get('/get_candidate_votes_by_election_id', (req, res) => {

    const {electionID} = req.body;

    db.query("SELECT studentCandidateID, COUNT(*) AS TotalVotes FROM vote WHERE electionID=? GROUP BY studentCandidateID", [electionID], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"Total Votes in Election": result})
    })
})
app.get('/get_election_votes_by_candidate_id', (req, res) => {

    const {electionID, candidateID} = req.body;

    db.query("SELECT studentCandidateID, COUNT(*) AS TotalVotes FROM vote WHERE electionID=? AND studentCandidateID =? ", [electionID, candidateID], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"Total Votes in Election": result})
    })
})

app.post('/store_council_results', (req, res) => {
    let election_res = []
    let max_votes = -1
    let winnerName = '';
    // db.query("SELECT DISTINCT councilElectionID FROM council_election_results", (err, results) => {
    //     if (err) {
    //         console.log(err);
    //         res.send({'Error': err})
    //     } else {
    //         for (let councilElectionId of results) {
    //             let CEID=councilElectionId.councilElectionID;
    //             console.log(CEID)
    db.query("SELECT studentCandidateID,CONCAT(firstName,' ',lastName)As name, COUNT(*) AS TotalVotes, councilElectionID " +
        "FROM vote V,council_election_results R,student " +
        "WHERE V.electionID__FK = R.electionID_COUNCIL_FK and student.studentUsername=V.studentCandidateID " +
        "GROUP BY studentCandidateID,electionID__FK " +
        "ORDER BY TotalVotes DESC", (err, results) => {
        if (err) {
            console.log(err);
            res.send({'Error': err})
        } else {
            console.log(results.length)
            for (let result of results) {
                candidates = result
                Name = candidates.name
                Id = candidates.studentCandidateID;
                Value = candidates.TotalVotes;
                councilElectionID = candidates.councilElectionID;
                electionName = 'Student Council'
                if (parseInt(Value) > max_votes) {
                    max_votes = parseInt(Value)
                    winnerName = Name
                }
                election_res.push({Id, Name, electionName, councilElectionID, Value})
            }
            //     db.query("INSERT INTO council_seat VALUES (?)", [[0, councilElectionID, winnerId]], (err) => {
            //         if (err) {
            //             console.log(err)
            //             res.status(400).json({'Error': err})
            //         }
            election_res.push({winnerName});
            console.log(election_res)
            res.send({'Results': election_res});
        }
    })
    // }
    // }
    // })
});

app.post('/store_club_results_by_position', (req, res) => {
    const electionID = req.body.electionID;
    const position = req.body.position;

    db.query("SELECT MAX(TotalVotes) AS maxVotes, studentCandidateID FROM (SELECT studentCandidateID, COUNT(*) AS TotalVotes, clubName FROM vote V, club C, candidate_form F, student_election_form E\
    WHERE V.electionID = C.clubElectionID AND E.electionID = V.electionID AND E.formID = F.formID AND V.electionID=? AND  F.electionPosition =? GROUP BY studentCandidateID) AS Y", [electionID, position], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        // winnerId = result[0].studentCandidateID;
        // maxVotes = result[0].maxVotes;

        // db.query("INSERT INTO council_seat VALUES (?)", [0, electionID, winnerId], (err) =>{
        //     if (err){
        //         console.log(err)
        //         res.status(400).json({'Error': err})
        //     }
        // })
        res.send({"Total Winner Votes in Election": result})
    })
})

app.post('/store_rep_results', (req, res) => {
    let election_res = []
    let max_votes = -1
    let winnerName = '';

    db.query("SELECT CONCAT(firstName, ' ', lastName) AS name, COUNT(DISTINCT V.studentVoterID) AS TotalVotes, repElectionID ,repMajor " +
        "FROM vote V, rep_election_results R, student_election_form SF, student S " +
        "WHERE V.electionID__FK = R.electionID_FK AND SF.electionID = electionID__FK AND V.studentCandidateID = S.studentUsername " +
        "GROUP BY V.studentCandidateID,repElectionID", (err, results) => {
        console.log(results)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        } else {
            console.log(results.length)
            for (let result of results) {
                candidates = result
                Name = candidates.name
                Id = candidates.studentUsername;
                Value = candidates.TotalVotes;
                repElectionID = candidates.repElectionID;
                electionName = candidates.repMajor + ' Student Representative'
                if (parseInt(Value) > max_votes) {
                    max_votes = parseInt(Value)
                    winnerName = Name
                }
                election_res.push({Id, Name, electionName, repElectionID, Value})
            }
            //     db.query("INSERT INTO council_seat VALUES (?)", [[0, councilElectionID, winnerId]], (err) => {
            //         if (err) {
            //             console.log(err)
            //             res.status(400).json({'Error': err})
            //         }
            election_res.push({winnerName});
            console.log(election_res)
            res.send({'Results': election_res});
        }
    })
})
app.get('/get_club_candidates_by_position_by_election_id', (req, res) => {
    const {clubName, position, electionID} = req.body;

    db.query("SELECT firstName, lastName, S.studentUsername, electoralProgram from candidate_form C, student_election_form SE, student S, student_club SC, club\
        WHERE  SC.studentUsername = S.studentUsername AND C.formID = SE.formID AND SE.electionID = club.clubElectionID \
        AND club.clubName = ? AND C.electionPosition =? AND C.status=1 AND club.ElectionID =?", [clubName, position, electionID], (err, result) => {


        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"club election candidates by position": result})
    })

})

app.get('/get_club_candidates_by_position', (req, res) => {
    const {clubName, position} = req.body;

    db.query("SELECT firstName, lastName, S.studentUsername, electoralProgram from candidate_form C, student_election_form SE, student S, student_club SC, club\
        WHERE  SC.studentUsername = S.studentUsername AND C.formID = SE.formID AND SE.electionID = club.clubElectionID \
        AND club.clubName = ? AND C.electionPosition =? AND C.status=1", [clubName, position], (err, result) => {


        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"club election candidates by position": result})
    })

})
app.post('/remove_student_from_club', (req, res) => {
    const {clubName, cookies} = req.body;

    let studentUsername = jwt_decode(cookies)['id']
    db.query("DELETE FROM student_club WHERE studentUsername =? AND clubName =?", [studentUsername, clubName], (err, result) => {
        console.log(result)
        if (err) {
            console.log(err);
            res.send({'Error': err})
        }
        res.send({"Student Removed from Club": result})
    })


})
app.get('/get_students_in_club', (req, res) => {

    const clubName = req.body.clubName;

    db.query("SELECT * FROM student_club,student WHERE student_club.studentUsername = student.studentUsername AND student_club.clubName =?",
        [clubName], (err, result) => {
            console.log(result)
            if (err) {
                console.log(err);
                res.send({'Error': err})
            }
            res.send({"Students in Club": result})
        })


})
app.get('/get_students_in_club_by_id', (req, res) => {
    const clubName = req.body.clubName;
    const cookies = req.body.cookies;

    let studentUsername = jwt_decode(cookies)['id']
    db.query("SELECT * FROM student_club,student WHERE student_club.studentUsername = student.studentUsername AND student_club.clubName =? AND student_club.studentUsername =?",
        [clubName, studentUsername], (err, result) => {
            console.log(result)
            if (err) {
                console.log(err);
                res.send({'Error': err})
            }
            res.send({"Student in Club": result})
        })

})
app.post('/create_club', (req, res) => {
    const {clubName, clubDescription} = req.body;

    let values = [0, clubName, clubType, clubDescription]
    db.query("SELECT * FROM club WHERE clubName=?", [clubName], (err, result) => {
        if (result.length > 0) {
            console.log(result)
            return res.status(422).json({'Error': "Club already exists"});
        } else {
            db.query("INSERT INTO club(clubName, clubDescription) VALUES (?)", [values], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'Error': err})
                }
                res.send({'message': 'Club Successfully Created!'})
            })
        }
    })
})
app.post('/update_club_information', (req, res) => {
    const {
        clubName,
        clubDescription,
        president,
        vicePresident,
        secretary,
        treasurer,
        clubElectionYear,
        clubElectionID
    } = req.body;

    db.query("UPDATE club SET clubDescription=?, president=?, vicePresident=?, secretary=?, treasurer=?, clubElectionYear=?, clubElectionID=? WHERE clubName=?",
        [clubDescription, president, vicePresident, secretary, treasurer, clubElectionYear, clubElectionID, clubName], (err, result) => {
            if (err) {
                console.log(err)
                res.send({'Error': err})
            }
            res.send({'message': 'Club successfully updated!'})
        })
})
app.get('/get_clubs', (req, res) => {

    db.query("SELECT * FROM club", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err})
        }
        res.send({"Clubs": result})
    })
})

app.post('/register_student_in_club', (req, res) => {
    const {clubName, cookies} = req.body;

    const studentUsername = jwt_decode(cookies)['id']

    let values = [0, studentUsername, clubName]

    db.query("SELECT * FROM student_club WHERE studentUsername =? AND clubName =?", [studentUsername, clubName], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'Error': err})
        }
        if (result.length > 0) {
            res.send({'Error': 'Student Already Registered in Club!'})

        } else {
            db.query("INSERT INTO student_club VALUES (?)", [values], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({'Error': err})
                }
                res.send({'message': 'Successfully Registered in Club!'})

            })
        }
    })
})

app.listen(PORT, (err) => {
    if (err)
        throw err;
    console.log('listening on port ', PORT);
});