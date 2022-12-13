import Navbar from "../components/Navbar";
import {useEffect, useState} from "react";
import axios from "axios";
import GenerateElectionsTable from "../components/GenerateElectionsTable";
import {useCookies} from "react-cookie";
import {retrieveElections} from "../requests/elections";


const Home = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    const [admin, setAdmin] = useState(false);
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
    useEffect( () => {
        getElections();
    }, [])
    return (
        <div>
            <Navbar/>
            <div>
                {GenerateElectionsTable(elections)}
            </div>
        </div>

    )
}

export default Home