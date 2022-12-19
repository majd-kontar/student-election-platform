import Navbar from "../components/Navbar";
import ResultsChart from "../components/ResultsChart";
import {retrieveElections, retrieveResults} from "../requests/elections";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";

const Results = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    const [results, setResults] = useState([]);
    const getResults = async () => {
        retrieveResults(cookies).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
                setResults(data['ERROR']);
            } else {
                setResults(data['Result']);
                console.log(data);
            }
        }).catch(error => {
            console.log(error)
        });
    }
    useEffect(() => {
        getResults();
    }, [])
    let data = [
        ["Votes", "Votes per Candidate"],
        ["Jane Doe", 11],
        ["John Doe", 2],
        ["Marie Dreary", 2],
        ["Ali Hassan", 7],
    ];
    return (
        <div>
            <Navbar/>
            <div>
                <h1>Computer Engineering Representative</h1>
                <h2>Winner: {data[1][0]}</h2>
                <div className='pie-chart'>
                    <ResultsChart data={data}/>
                </div>
            </div>
            <div className="horizontal-rule"/>
        </div>
    )

}
export default Results;