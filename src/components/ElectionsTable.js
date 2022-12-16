import Requests from "./Requests";
import React from 'react'
import "./Tables.css"


const ElectionsTable = (props) => {
    let tableData = props['tableData'];
    let type = props['type'];
    let headers = [];
    let data = [];
    let electionID = '';
    let indexOfElectionID = 0;
    tableData.forEach((value) => {
        data.push(Object.values(value))
    })
    for (let key in tableData[0]) {
        headers.push(key);
        if (key === 'electionID') {
            indexOfElectionID = headers.indexOf(key);
        }
    }
    return (
        <table className="table">
            <thead>
            <tr>
                {headers.map((header) => (
                    <th>
                        {header}
                    </th>
                ))}
                <th>
                    Vote
                </th>
                <th>
                    Register
                </th>
            </tr>
            </thead>
            <tbody>{data.map((values) => (
                <tr>
                    {values.map((value) => (
                        <td>
                            {value}
                        </td>
                    ))}
                    <td>
                        <Requests type='vote' electionType={type} electionID={values[indexOfElectionID]}/>
                    </td>
                    <td>
                        <Requests type='register' electionType={type} electionID={values[indexOfElectionID]}/>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default ElectionsTable;