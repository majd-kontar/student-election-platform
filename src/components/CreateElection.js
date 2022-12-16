import React, {Fragment, useContext, useEffect, useState} from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import "./CreateElection.css"
import {useCookies} from "react-cookie";
import OptionGenerator from "./OptionGenerator";
import {campuses, clubs, majors} from "../data/data";
import {submitCreateElectionForm} from "../requests/elections";


const CreateElection = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    let [message, setMessage] = useState('')
    let [popup, setPopup] = useState('')
    let [type, setType] = useState('')
    let [endDate, setEndDate] = useState(new Date());
    let [club, setClub] = useState('')
    let [major, setMajor] = useState('')
    let [campus, setCampus] = useState('')
    const [modalIsOpen, setIsOpen] = React.useState(false);


    const openModal = () => {
        setMessage('')
        setClub('')
        setCampus('')
        setEndDate(new Date())
        setIsOpen(true);
    }


    const closeModal = () => {
        setIsOpen(false);
    }
    const handleChange = (event) => {
        setType(event.target.value)
    }

    const handleSubmit = async () => {
        if (type === '' || campus === '') {
            return setMessage('Please Fill All Fields!')
        }
        if (endDate <= new Date()) {
            return setMessage('Please Enter a Valid Date and Time')
        }
        if (type === 'Club' && club === '') {
            return setMessage('Please Fill All Fields!')
        }
        if (type === 'Representative' && major === '') {
            return setMessage('Please Fill All Fields!')
        }
        submitCreateElectionForm(type, campus, club, major, endDate, cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                setMessage(data['ERROR']);
            } else {
                console.log(response);
                closeModal();
            }
        }).catch(error => {
            console.log(error['message'])
            setMessage(error['message']);
        });
    }

    useEffect(() => {
        setPopup(<div>
            <h2>Create Election</h2>
            <span style={{color: 'red'}}>{message}</span>
            <form>
                <div className="form-group mt-3">
                    <label>Choose Election Type</label>
                    <div className='option'>
                        <input type="radio" value="Club" name="electionType" className='radiobtn'
                               onChange={handleChange}/> Club
                        <input type="radio" value="Representative" name="electionType" className='radiobtn'
                               onChange={handleChange}/> Representative
                        <input type="radio" value="Council" name="electionType" className='radiobtn'
                               onChange={handleChange}/> Council
                    </div>
                    <label>Choose Campus</label>
                    <div className='option'>
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
                    {type === 'Club' &&
                    <Fragment>
                        <label>Choose Club</label>
                        <div className='option'>
                            <select
                                className="form-control mt-1"
                                required={true}
                                onChange={e => {
                                    setClub(e.target.value)
                                }}
                                value={club}
                            >
                                <OptionGenerator options={clubs}/>
                            </select>
                        </div>
                    </Fragment>}
                    {type === 'Representative' &&
                    <Fragment>
                        <label>Choose Major</label>
                        <div className='option'>
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
                    </Fragment>
                    }
                    <label>Choose End Time</label>
                    <div>
                        <DateTimePicker className='datepicker' onChange={setEndDate} value={endDate}
                                        minDate={new Date()}
                                        required={true}
                                        clearIcon={null}/>
                    </div>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="button" className="submitButton" onClick={() => {
                        handleSubmit()
                    }}>
                        Submit
                    </button>
                </div>
            </form>
        </div>)
    }, [type, club, campus, major, endDate, message])

    return (
        <div>
            <button onClick={openModal}>Create Election</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                {popup}
                <div className="d-grid gap-2 mt-3">
                    <button className="submitButton" onClick={closeModal}>close</button>
                </div>
            </Modal>
        </div>
    )
}
export default CreateElection;