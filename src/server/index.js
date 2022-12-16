const express = require('express');
const db = require('./config/db')
const cors = require('cors')
const {DATETIME} = require("mysql/lib/protocol/constants/types");

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json())

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM student WHERE studentUsername=? AND studentPassword=?",
        [username, password], (err, result) => {
            if (err || result.length===0) {
                console.log(err)
                res.send({'ERROR': err});
            } else {
                res.send({
                    'Result': result,
                    'token': '08508fa0sf8as',
                    'id': username
                })
            }
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
                    res.send({
                        'Result': result,
                        'token': '08508fa0sf8as',
                        'id': username
                    });
                });
        }
    });
})

app.get('/get_elections', (req, res) => {
    var clubs = '';
    var representatives = '';
    var councils = '';
    db.query("select * from club,election where clubElectionID=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        clubs = result;
    });
    db.query("select * from council_election_results,election where council_election_results.electionID_COUNCIL_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        councils = result
    });
    db.query("select * from rep_election_results,election where rep_election_results.electionID_FK=election.electionID", (err, result) => {
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
app.get('/get_requests', (req, res) => {
    let output = '';
    db.query("select * from candidate_form,student_election_form,student where candidate_form.formID=student_election_form.formID AND student_election_form.studentUsername_FK=student.studentUsername AND candidate_form.status IS NULL", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        output = result;
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});
app.get('/get_elections_by_id', (req, res) => {
    var clubs = '';
    var representatives = '';
    var councils = '';
    var student_id = req.body.student_id;
    db.query("select * from club,election,student_club where clubElectionID=election.electionID AND student_club.clubID=club.clubID AND student_club.studentUsername='%s'", student_id, (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        clubs = result;
    });
    db.query("select * from council_election_results,election where council_election_results.electionID_COUNCIL_FK=election.electionID", (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        councils = result
    });
    db.query("select * from rep_election_results,election where rep_election_results.electionID_FK=election.electionID", (err, result) => {
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
            },
            'token': '08508fa0sf8as'
        });
    });

})
//FIX: added adminUsename to db on accept/reject 
// app.get('/accept_form', (req, res) => {
//     let output = 'Done';
//     let formId = req.query.formId;

//     db.query("UPDATE candidate_form SET status=1 WHERE formID=?", [formId], (err) => {
//         if (err) {
//             console.log(err)
//             res.send({'ERROR': err});
//         }
//         res.send({
//             'Result': output,
//             'token': '08508fa0sf8as'
//         });
//     });
// });
// app.get('/reject_form', (req, res) => {
//     let output = '';
//     let formId = req.query.formId;
//     db.query("UPDATE candidate_form SET status=0 WHERE formID=?", [formId], (err) => {
//         if (err) {
//             console.log(err)
//             res.send({'ERROR': err});
//         }
//         res.send({
//             'Result': output,
//             'token': '08508fa0sf8as'
//         });
//     });
// });
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
    let studentId = req.body.userId;
    let studentCandidateId = req.body.vote;
    db.query("INSERT INTO vote(studentVoterID,studentCandidateID,electionID,voteTime) VALUES (?)", [[studentId, studentCandidateId, electionId, new Date()]], (err, result) => {
        if (err) {
            console.log(err)
            res.send({'ERROR': err});
        }
        output = result;
        console.log(result)
        res.send({
            'Result': output,
            'token': '08508fa0sf8as'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})