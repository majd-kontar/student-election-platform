import Form from "./Form";
import axios from "axios";
import {useState} from "react";
import Requests from "./Requests";
import {useNavigate} from "react-router-dom";

const RequestsTable = (props) => {
    let tableData = props['tableData'];
    let headers = [];
    let data = [];
    let indexOfRequestID = 0;
    for (let key in tableData) {
        headers.push(key);
        data.push(tableData[key])
        if (key === 'formID') {
            indexOfRequestID = headers.indexOf(key);
        }
    }
    console.log(headers)
    console.log(data)
    // tableData.forEach((value) => {
    //     data.push(Object.values(value))
    const handleApprove = async (formId) => {
        axios.get('http://localhost:3002/accept_form/', {params: {formId: formId}}).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
                return {'ERROR': data['ERROR']};
            } else {
                console.log(data['Result']);
                return data['Result'];
            }
        }).catch(error => {
            console.log(error)
            return {'ERROR': 'Error'};
        });
    }
    const handleReject = async (formId) => {
        axios.get('http://localhost:3002/reject_form', {params: {formId: formId}}).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
                // setRequests({'ERROR': data['ERROR']});
            } else {
                // setRequests(data['Result']);
                console.log(data['Result']);
            }
        }).catch(error => {
            console.log(error)
            // setRequests({'ERROR': 'Error'});
        });
    }

    // })
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
            <tbody>
            <tr>
                {data.map((values) => (
                    <td>
                        {values}
                    </td>
                ))}
                <td>
                    <button type='submit' onClick={() => {
                        handleApprove(data[indexOfRequestID]);
                    }}>Approve
                    </button>
                </td>
                <td>
                    <button type='submit' onClick={() => {
                        handleReject(data[indexOfRequestID]);
                    }}>Reject
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    )
}
export default RequestsTable;