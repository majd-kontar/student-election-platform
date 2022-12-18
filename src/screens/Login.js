import React, {useContext, useEffect, useState} from "react"
import "./Login.css"
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {signin, signup} from "../requests/profile";


const Login = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    const navigate = useNavigate()
    let [message, setMessage] = useState('')
    let passwordMessage = 'Passwords don\'t match'
    let [authMode, setAuthMode] = useState("signin")
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [studentEmail, setStudentEmail] = useState('')
    let [username, setUsername] = useState('')


    useEffect(() => {
        setMessage('')
    }, [authMode])

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const handleSignIn = e => {
        e.preventDefault();
        if (username.length > 0 && password.length > 0) {
            signin(username, password).then((response) => {
                    setCookie("access-token", response.headers.get("access-token"), {
                        maxAge: 2592000
                    });
                    console.log(response);
                    navigate('/elections')
                }
            ).catch(error => {
                try {
                    console.log(error)
                    setMessage(error.response.data['Error'])
                } catch {
                    setMessage(error.message)
                }

            });
        } else {
            setMessage("Please fill all the fields!")
        }
    }
    const handleSignUp = e => {
        e.preventDefault();
        if (firstName.length > 0 && lastName.length > 0 && username.length > 0 && studentEmail.length > 0 && password.length > 8 && confirmPassword === password) {
            signup(firstName, lastName, username, studentEmail, password).then((response) => {
                const data = response.data
                console.log(data);
                navigate('/profile')
            }).catch(error => {
                try {
                    console.log(error.response.data['Error'])
                    setMessage(error.response.data['Error'])
                } catch {
                    setMessage(error.message)
                }
            });
        } else {
            setMessage("Please fill all the fields!")
        }
    }


    if (authMode === "signin") {
        return (
            <div className="Background">
                <div className="Auth-form-container">
                    <form className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title">Sign In</h3>
                            <div className="text-center">
                                Not registered yet?{" "}
                                <span className="link" onClick={changeAuthMode}>
                Sign Up
              </span>
                            </div>
                            <span style={{color: 'red'}}>{message}</span>
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
                                <button type="submit" className="submitButton"
                                        onClick={handleSignIn}>
                                    Submit
                                </button>
                            </div>
                            <p className="text-center mt-2">
                                Forgot <a className='link' href="#">password?</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="Background">
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign Up</h3>
                        <div className="text-center">
                            Already registered?{" "}
                            <span className="link" onClick={changeAuthMode}>
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
                            <label>Username</label>
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
                                minLength="8"
                                required={true}
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                                value={password}
                            />
                            {(password.length < 8 && password.length > 0) ?
                                <span style={{color: 'red'}}>Password is too short</span> : <span/>}
                        </div>
                        <div className="form-group mt-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Re-write password"
                                required={true}
                                onChange={e => {
                                    setConfirmPassword(e.target.value)
                                }}
                                value={confirmPassword}
                            />
                            {(password !== confirmPassword && password !== '') ?
                                <span style={{color: 'red'}}>{passwordMessage}</span> : <span/>}
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="submitButton" onClick={handleSignUp}>
                                Submit
                            </button>
                        </div>
                        <p className="text-center mt-2">
                            Forgot <a className='link' href="#">password?</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login