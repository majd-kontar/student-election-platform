import Navbar from "../components/Navbar";
import './Elections.css';
import React, {useContext, useEffect, useState} from "react";
import GenerateElectionsTable from "../components/GenerateElectionsTable";
import {retrieveElections} from "../requests/elections";
import {useCookies} from "react-cookie";
import decode from "../components/DecodeToken";
import Requests from "../components/Requests";
import CreateElection from "../components/CreateElection";


const Elections = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    const admin = decode(cookies)['admin']
    const [elections, setElections] = useState([]);
    const getElections = async () => {
        retrieveElections(cookies).then((response) => {
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
    const handleCreateElection = () => {
        return <CreateElection/>
    }
    useEffect(() => {
        getElections();
    }, [])
    return (
        <div>
            <Navbar/>
            {admin &&
            <div className='createElection'>
                <CreateElection/>
            </div>}

            <div>
                {GenerateElectionsTable(elections)}
            </div>
        </div>

    )
}
export default Elections;