import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import "./Request.css"
import axios from "axios";
import {useCookies} from "react-cookie";
import {retrieveCandidates, retrieveElections, submitCandidateForm, submitVoteForm} from "../requests/elections";
import OptionGenerator from "./OptionGenerator";


const Requests = (props) => {
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
                console.log(data);
            }
        }).catch(error => {
            console.log(error)
        });
    }
    const openModal = () => {
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
            submitCandidateForm(position, program, cookies).then((response) => {
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
        } else {
            submitVoteForm(data[vote]['studentUsername'], electionID, cookies).then((response) => {
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
    }

    useEffect(() => {
        if (props.type === 'vote') {
            setLabel('Vote');
            setPopup(<div>
                <h2>Vote</h2>
                <span style={{color: 'red'}}>{message}</span>
                <form>
                    <div className="form-group mt-3">
                        <label>Choose candidate</label>
                        <select
                            className="form-control mt-1"
                            required={true}
                            onChange={e => {
                                setVote(e.target.value)
                            }}
                            value={vote}
                        >
                            <option value="">Choose an option</option>
                            <OptionGenerator options={candidates}/>
                        </select>
                        <label>
                            Program
                        </label>
                        <p>
                            {vote !== '' ? data[vote]['electoralProgram'] : ' '}
                        </p>
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
                        {props.electionType === 'Clubs' ?
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
                                    <option value="">Choose an option</option>
                                    <OptionGenerator options={clubPositions}/>
                                </select>
                            </div> :
                            undefined
                        }
                    </div>
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
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="submitButton" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>)
        }
    }, [candidates, vote])


    return (
        <div>
            <button onClick={openModal}>{label}</button>
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
export default Requests;