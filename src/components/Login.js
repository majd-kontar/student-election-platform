import React, {useState} from "react"
import "./Login.css"
import axios from 'axios';


const Login = (props) => {
    let [message, setMessage] = useState('')
    let [authMode, setAuthMode] = useState("signin")
    let [password, setPassword] = useState('')
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [school, setSchool] = useState('')
    let [major, setMajor] = useState('')
    let [cls, setCls] = useState('')
    let [campus, setCampus] = useState('')
    let [address, setAddress] = useState('')
    let [phoneNb, setPhoneNb] = useState('')
    let [studentEmail, setStudentEmail] = useState('')
    let [username, setUsername] = useState('')
    let [studentRecoveryEmail, setStudentRecoveryEmail] = useState('')


    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const handleSignIn = e => {
        e.preventDefault();
        axios.post('http://localhost:3002/login', {
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
        }).catch(error => {
            console.log(error)
        });
    }
    const handleSignUp = e => {
        e.preventDefault();
        axios.put('http://localhost:3002/register', {
            firstName: firstName,
            lastName: lastName,
            school: school,
            major: major,
            cls: cls,
            campus: campus,
            address: address,
            phoneNb: phoneNb,
            username: username,
            studentEmail: studentEmail,
            studentPassword: password,
            studentRecoveryEmail: studentRecoveryEmail
        }).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                setMessage(data['ERROR']);
            }
        }).catch(error => {
            console.log(error)
        });
    }


    if (authMode === "signin") {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="text-center">
                            Not registered yet?{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                                id='email'
                                type="email"
                                className="form-control mt-1"
                                placeholder="Enter Username"
                                required={true}
                                onChange={e => {
                                    setUsername(e.target.value)
                                }}
                                value={username}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter password"
                                required={true}
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                                value={password}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary"
                                    onClick={handleSignIn}>
                                Submit
                            </button>
                        </div>
                        <p className="text-center mt-2">
                            Forgot <a href="#">password?</a>
                        </p>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
                    </div>
                    <span style={{color: 'red'}}>{message}</span>
                    <div className="form-group mt-3">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g Jane"
                            required={true}
                            onChange={e => {
                                setFirstName(e.target.value)
                            }}
                            value={firstName}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g Doe"
                            required={true}
                            onChange={e => {
                                setLastName(e.target.value)
                            }}
                            value={lastName}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>School</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g ECE"
                            required={true}
                            onChange={e => {
                                setSchool(e.target.value)
                            }}
                            value={school}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Major</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g Mechatronics"
                            required={true}
                            onChange={e => {
                                setMajor(e.target.value)
                            }}
                            value={major}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Standing</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g 5"
                            required={true}
                            onChange={e => {
                                setCls(e.target.value)
                            }}
                            value={cls}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Campus</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g Byblos"
                            required={true}
                            onChange={e => {
                                setCampus(e.target.value)
                            }}
                            value={campus}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Address</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g Aley, Lebanon"
                            required={true}
                            onChange={e => {
                                setAddress(e.target.value)
                            }}
                            value={address}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g 71705620"
                            required={true}
                            onChange={e => {
                                setPhoneNb(e.target.value)
                            }}
                            value={phoneNb}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="e.g majd.alkontar@lau.edu"
                            required={true}
                            onChange={e => {
                                setStudentEmail(e.target.value)
                            }}
                            value={studentEmail}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>'Username'</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="e.g majd-kontar"
                            required={true}
                            onChange={e => {
                                setUsername(e.target.value)
                            }}
                            value={username}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            required={true}
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                            value={password}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Recovery Email</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="e.g majdkontar@gmail.com"
                            required={true}
                            onChange={e => {
                                setStudentRecoveryEmail(e.target.value)
                            }}
                            value={studentRecoveryEmail}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={handleSignUp}>
                            Submit
                        </button>
                    </div>
                    <p className="text-center mt-2">
                        Forgot <a href="#">password?</a>
                    </p>
                </div>
            </form>
        </div>
    )
}


export default Login