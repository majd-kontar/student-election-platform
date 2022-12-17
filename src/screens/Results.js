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
        ["Work", 11],
        ["Eat", 2],
        ["Commute", 2],
        ["Watch TV", 2],
        ["Sleep", 7],
    ];
    return (
        <div>
            <Navbar/>
            <div className='pie-chart'>
                <ResultsChart title='Sample Chart' data={data}/>
            </div>
            <div className="horizontal-rule"/>
        </div>
    )

}
export default Results;