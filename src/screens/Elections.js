import Navbar from "../components/Navbar";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import GenerateElectionsTable from "../components/GenerateElectionsTable";
import {retrieveElections} from "../requests/elections";
import {useCookies} from "react-cookie";

const Elections = (props) => {
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
    useEffect(() => {
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
export default Elections;