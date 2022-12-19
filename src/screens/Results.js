import Navbar from "../components/Navbar";
import ResultsChart from "../components/ResultsChart";
import {retrieveCouncilResults, retrieveElections, retrieveRepResults, retrieveResults} from "../requests/elections";
import {Fragment, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import inventory from "bootstrap/js/src/dom/selector-engine";

const Results = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    const [results, setResults] = useState([]);
    const [councilWinner, setCouncilWinner] = useState('');
    const [councilElectionName, setCouncilElectionName] = useState('');
    const [councilData, setCouncilData] = useState([])
    const [repWinner, setRepWinner] = useState('');
    const [repElectionName, setRepElectionName] = useState('');
    const [repData, setRepData] = useState([])
    const getResults = async () => {
        retrieveCouncilResults(cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
            } else {
                console.log(data)
                setCouncilData(data['Results'])
                setCouncilWinner(data['Results'][data['Results'].length - 1]['winnerName'])
                setCouncilElectionName(data['Results'][0]['electionName'])
            }
        }).catch(error => {
            console.log(error)
        });
        retrieveRepResults(cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
            } else {
                console.log(data)
                setRepData(data['Results'])
                setRepWinner(data['Results'][data['Results'].length - 1]['winnerName'])
                setRepElectionName(data['Results'][0]['electionName'])
            }
        }).catch(error => {
            console.log(error)
        });
    }
    useEffect(() => {
        getResults()
    }, [])


    return (
        <div>
            <Navbar/>
            <div>
                {councilData.length > 1 &&
                <Fragment>
                    <h1>{councilElectionName}</h1>
                    <h2>Winner: {councilWinner}</h2>
                    <div className='pie-chart'>
                        <ResultsChart data={councilData}/>
                    </div>
                </Fragment>}
                {repData.length > 1 &&
                <Fragment>
                    <h1>{repElectionName}</h1>
                    <h2>Winner: {repWinner}</h2>
                    <div className='pie-chart'>
                        <ResultsChart data={repData}/>
                    </div>
                </Fragment>}
            </div>
            <div className="horizontal-rule"/>
        </div>
    )

}
export default Results;