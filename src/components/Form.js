import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import "./Form.css"
import axios from "axios";
import UseToken from "./UseToken";


const Form = (props) => {
    let [position, setPosition] = useState('')
    let [program, setProgram] = useState('')
    let [message, setMessage] = useState('')
    let [label, setLabel] = useState('')
    let [popup, setPopup] = useState('')
    let [candidates, setCandidates] = useState([])
    let [vote, setVote] = useState('')
    let [data, setData] = useState([])
    let candi = []
    const [token, setToken] = UseToken();
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const getCandidates = async (electionID) => {
        axios.get('http://localhost:3002/get_candidates_by_election_id', {params: {electionID: electionID}}).then((response) => {
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
        getCandidates(props.electionID);
        setIsOpen(true);
    }


    const closeModal = () => {
        setIsOpen(false);
    }

    const handleSubmit = async (electionID) => {
        if (props.type === 'register') {
            axios.put('http://localhost:3002/submit_candidate_form', {
                position: position,
                program: program,
            }).then((response) => {
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
            axios.post('http://localhost:3002/submit_vote_form', {
                    userId: token,
                    vote: data[vote]['studentUsername'],
                    electionId: electionID
                }
            ).then((response) => {
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
                            {candidates.map((candidate) => (
                                <option value={candidates.indexOf(candidate)}>
                                    {candidate}
                                </option>
                            ))};
                        </select>
                        <label>
                            Program
                        </label>
                        <p>
                            {vote !== '' ? data[vote]['electoralProgram'] : ' '}
                        </p>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={() => {
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
                        <label>Position</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter Position"
                            required={true}
                            onChange={e => {
                                setPosition(e.target.value)
                            }}
                            value={position}
                        />
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
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>)
        }
    }, [candidates, vote])


    return (<div>
        <button onClick={openModal}>{label}</button>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
        >
            {popup}
            <div className="d-grid gap-2 mt-3">
                <button className="btn btn-primary" onClick={closeModal}>close</button>
            </div>
        </Modal>
    </div>)
}
export default Form;