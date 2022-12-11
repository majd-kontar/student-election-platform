import React, {useContext, useState} from "react"
import "./Login.css"
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import TokenContext from "./TokenContext";


const Login = (props) => {
    const navigate = useNavigate()
    let {token, setToken} = useContext(TokenContext)
    let [message, setMessage] = useState('')
    let passwordMessage = 'Passwords don\'t match'
    let [authMode, setAuthMode] = useState("signin")
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [studentEmail, setStudentEmail] = useState('')
    let [username, setUsername] = useState('')


    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const handleSignIn = e => {
        e.preventDefault();
        axios.post('http://localhost:3002/login', {
            username: username,
            password: password
        }).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                setMessage(data['ERROR']);
            } else {
                setToken(response.data.id)
                console.log(response);
                navigate('/home')
            }
        }).catch(error => {
            console.log(error)
        });
    }
    const handleSignUp = e => {
        e.preventDefault();
        if (password === confirmPassword) {
            axios.put('http://localhost:3002/register', {
                firstName: firstName,
                lastName: lastName,
                username: username,
                studentEmail: studentEmail,
                studentPassword: password,
            }).then((response) => {
                const data = response.data
                if (data['ERROR']) {
                    setMessage(data['ERROR']);
                } else {
                    setToken(response.data.id)
                    console.log(response);
                    navigate('/profile')
                }
            }).catch(error => {
                console.log(error)
            });
        }
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
                    <h3 className="Auth-form-title">Sign Up</h3>
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
                            required={true}
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                            value={password}
                        />
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