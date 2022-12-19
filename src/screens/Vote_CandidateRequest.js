import React, {Fragment, useContext, useEffect, useReducer, useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import "./Vote_CandidateRequest.css"
import axios from "axios";
import {useCookies} from "react-cookie";
import {retrieveCandidates, retrieveElections, submitCandidateForm, submitVoteForm} from "../requests/elections";
import OptionGenerator from "../functions/OptionGeneratorUsingIndex";


const Vote_CandidateRequest = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    let [position, setPosition] = useState('')
    let [program, setProgram] = useState('')
    let [message, setMessage] = useState('')
    let [label, setLabel] = useState('')
    let [popup, setPopup] = useState('')
    let [candidates, setCandidates] = useState([])
    let [vote, setVote] = useState('')
    let [data, setData] = useState([])
    let candi = []
    const clubPositions = ['President', 'Vice President', 'Treasurer', 'Secretary']
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const initialClubVote = {President: "", Vice_President: "", Treasurer: "", Secretary: ""};
    const [clubVote, setClubVote] = useReducer(
        (state, updates) => ({...state, ...updates}),
        initialClubVote
    );


    const getCandidates = async (electionID) => {
        retrieveCandidates(electionID, cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
            } else {
                setData(response.data.Result);
                response.data.Result.forEach((value) => {
                    candi.push(value['name'])
                })
                setCandidates(candi)
                setData(data.Result);
            }
        }).catch(error => {
            console.log(error)
        });
    }
    const openModal = () => {
        setVote('')
        setMessage('')
        setPosition('')
        setProgram('')
        setClubVote({President: "", Vice_President: "", Treasurer: "", Secretary: ""})
        if (props.type === 'vote') {
            getCandidates(props.electionID);
        }
        setIsOpen(true);
    }


    const closeModal = () => {
        setIsOpen(false);
    }

    const handleSubmit = async (electionID) => {
        if (props.type === 'register') {
            if ((props.electionType === 'Clubs' && position === '') || (props.electionType !== 'Clubs' && program === '')) {
                return setMessage("Please fill all the fields!")
            }
            submitCandidateForm(electionID, position, program, cookies).then((response) => {
                const data = response.data
                if (data['ERROR']) {
                    setMessage(data['ERROR']);
                } else {
                    console.log(response);
                    setMessage(data['message'])
                    // closeModal();
                    // window.location.reload();
                }
            }).catch(error => {
                console.log(error)
                setMessage(error['message']);
            });
        } else {
            if ((props.electionType !== 'Clubs' && vote === '') || (props.electionType === 'Clubs' && clubVote['President'] === '' && clubVote['Vice_President'] === '' && clubVote['Secretary'] === '' && clubVote['Treasurer'] === '')) {
                return setMessage("Please fill all the fields!")
            }
            setMessage('')
            submitVoteForm(props.electionType, data[vote]['studentUsername'], clubVote, electionID, cookies).then((response) => {
                const data = response.data
                if (data['ERROR']) {
                    setMessage(data['ERROR']);
                } else {
                    setMessage(data['message']);
                    // window.location.reload();
                    // closeModal();
                }
            }).catch(error => {
                console.log(error['message'])
                setMessage(error['message']);
            });
        }
    }

    useEffect(() => {
        if (props.type === 'vote') {
            console.log(clubVote)
            setLabel('Vote');
            setPopup(<div>
                <h2>Vote</h2>
                <span style={{color: 'red'}}>{message}</span>
                <form>
                    <div className="form-group mt-3">
                        {props.electionType === 'Clubs' ?
                            <Fragment>
                                <label>Choose candidates</label>
                                <div>
                                    <label>President</label>
                                    <select
                                        className="form-control mt-1"
                                        required={true}
                                        onChange={e => {
                                            setClubVote({President: e.target.value})
                                        }}
                                        value={clubVote['President']}
                                    >
                                        <OptionGenerator options={candidates}/>
                                    </select>
                                </div>
                                <div>
                                    <label>Vice President</label>
                                    <select
                                        className="form-control mt-1"
                                        required={true}
                                        onChange={e => {
                                            setClubVote({Vice_President: e.target.value})
                                        }}
                                        value={clubVote['Vice_President']}
                                    >
                                        <OptionGenerator options={candidates}/>
                                    </select>
                                </div>
                                <div>
                                    <label>Treasurer</label>
                                    <select
                                        className="form-control mt-1"
                                        required={true}
                                        onChange={e => {
                                            setClubVote({Treasurer: e.target.value})
                                        }}
                                        value={clubVote['Treasurer']}
                                    >
                                        <OptionGenerator options={candidates}/>
                                    </select>
                                </div>
                                <div>
                                    <label>Secretary</label>
                                    <select
                                        className="form-control mt-1"
                                        required={true}
                                        onChange={e => {
                                            setClubVote({Secretary: e.target.value})
                                        }}
                                        value={clubVote['Secretary']}
                                    >
                                        <OptionGenerator options={candidates}/>
                                    </select>
                                </div>
                            </Fragment> :
                            <Fragment>
                                <label>Choose candidate</label>
                                <select
                                    className="form-control mt-1"
                                    required={true}
                                    onChange={e => {
                                        setVote(e.target.value)
                                    }}
                                    value={vote}
                                >
                                    <OptionGenerator options={candidates}/>
                                </select>
                            </Fragment>}
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="submitButton" onClick={() => {
                            handleSubmit(props.electionID)
                        }}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>)
        } else {
            setLabel('Register')
            setPopup(<div><h2>Enroll In Election</h2>
                <span style={{color: 'red'}}>{message}</span>
                <form>
                    <div className="form-group mt-3">
                        {props.electionType === 'Clubs' &&
                        <div>
                            <label>Position</label>
                            <select
                                className="form-control mt-1"
                                required={true}
                                onChange={e => {
                                    setPosition(e.target.value)
                                }}
                                value={position}
                            >
                                <OptionGenerator options={clubPositions}/>
                            </select>
                        </div>
                        }
                    </div>
                    {props.electionType !== 'Clubs' &&
                    <div className="form-group mt-3">
                        <label>Program</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter Program"
                            required={true}
                            onChange={e => {
                                setProgram(e.target.value)
                            }}
                            value={program}
                        />
                    </div>}
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="submitButton" onClick={() => handleSubmit(props.electionID)}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>)
        }
    }, [candidates, vote, clubVote, position, program, message])


    return (
        <div>
            <button onClick={openModal} disabled={props.disabled}>{label}</button>
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
export default Vote_CandidateRequest;