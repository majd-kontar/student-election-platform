import Navbar from "./Navbar";
import VerifyAuth from "./VerifyAuth";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import TokenContext from "./TokenContext";
import DisplayElections from "./DisplayElections";

const Elections = (props) => {
    const [admin, setAdmin] = useState(false);
    const [elections, setElections] = useState([]);
    const getElections = async () => {
        axios.get('http://localhost:3002/get_elections', {}).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
                setElections(data['ERROR']);
            } else {
                setElections(data['Result']);
                console.log(data);
            }
        }).catch(error => {
            console.log(error)
            setElections([{'ERROR': 'Error'}]);
        });
    }
    useEffect(() => {
        getElections();
    }, [])
    return (
        <div>
            <Navbar/>
            <div>
                {DisplayElections(elections)}
            </div>
        </div>

    )
}
export default Elections;