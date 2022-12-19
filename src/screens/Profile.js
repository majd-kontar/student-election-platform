import Navbar from "../components/Navbar";
import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import OptionGenerator from "../functions/OptionGenerator";
import {getProfile, updateProfile} from "../requests/profile";
import {useCookies} from "react-cookie";
import {campuses, clubs, majors, schools, standings} from "../data/data";

const Profile = (props) => {
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies(["access-token"]);
    let [message, setMessage] = useState('')
    let [password, setPassword] = useState('')
    let [school, setSchool] = useState('')
    let [major, setMajor] = useState('')
    let [cls, setCls] = useState('')
    let [campus, setCampus] = useState('')
    let [address, setAddress] = useState('')
    let [phoneNb, setPhoneNb] = useState('')
    let [club1, setClub1] = useState('')
    let [club2, setClub2] = useState('')
    let [studentRecoveryEmail, setStudentRecoveryEmail] = useState('')

    const getProfileData = () => {
        getProfile(cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                setMessage(data['ERROR']);
            } else {
                setSchool(data['school']);
                setMajor(data['major']);
                setCls(data['cls']);
                setCampus(data['campus']);
                setAddress(data['address']);
                setPhoneNb(data['phoneNb']);
                setClub1(data['club1'])
                setClub2(data['club2'])
                setStudentRecoveryEmail(data['studentRecoveryEmail']);
            }
        }).catch(error => {
            console.log(error)
        });
    }

    const handleUpdateProfile = e => {
        e.preventDefault();
        if (school === '' || major === '' || cls === '' || address === '' || phoneNb === '' || password === '' || studentRecoveryEmail === '') {
            return setMessage("Please fill all the fields!")
        }
        if (club1 === club2) {
            return setMessage("You can't register in the same club twice!")
        }
        updateProfile(school, major, cls, campus, club1, club2, address, phoneNb, password, studentRecoveryEmail, cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                setMessage(data['ERROR']);
            } else {
                console.log(response);
                navigate('/home')
            }
        }).catch(error => {
            console.log(error)
        });
    }

    getProfileData()
    return (
        <div>
            <Navbar/>
            <div className="Background">
                <div className="Auth-form-container">
                    <form className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title">Edit Profile</h3>
                            <span style={{color: 'red'}}>{message}</span>
                            <div className="form-group mt-3">
                                <label>School</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setSchool(e.target.value)
                                    }}
                                    value={school}
                                >
                                    <OptionGenerator options={schools}/>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label>Major</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setMajor(e.target.value)
                                    }}
                                    value={major}
                                >
                                    <OptionGenerator options={majors}/>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label>Standing</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setCls(e.target.value)
                                    }}
                                    value={cls}
                                >
                                    <OptionGenerator options={standings}/>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label>Campus</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setCampus(e.target.value)
                                    }}
                                    value={campus}
                                >
                                    <OptionGenerator options={campuses}/>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label>Club 1</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setClub1(e.target.value)
                                    }}
                                    value={club1}
                                >
                                    <OptionGenerator options={clubs}/>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label>Club 2</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setClub2(e.target.value)
                                    }}
                                    value={club2}
                                >
                                    <OptionGenerator options={clubs}/>
                                </select>
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
                            <div className="form-group mt-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    placeholder="Re-enter password"
                                    required={true}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                    value={password}
                                />
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className='submitButton' onClick={handleUpdateProfile}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}
export default Profile;