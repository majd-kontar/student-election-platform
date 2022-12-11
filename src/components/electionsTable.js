import Form from "./Form";
import React from 'react'


const ElectionsTable = (props) => {
    let tableData = props['tableData'];
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
                        <Form type='vote' electionID={values[indexOfElectionID]}/>
                    </td>
                    <td>
                        <Form type='register' electionID={values[indexOfElectionID]}/>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default ElectionsTable;