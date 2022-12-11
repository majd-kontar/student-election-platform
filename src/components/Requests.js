import Navbar from "./Navbar";
import axios from "axios";
import {useEffect, useState} from "react";
import RequestsTable from "./RequestsTable";

const Requests = (props) => {
    let [requests, setRequests] = useState({})
    let tables = []

    const getRequests = async () => {
        axios.get('http://localhost:3002/get_requests', {}).then((response) => {
            const data = response.data
            if (data['ERROR']) {
                console.log(data['ERROR']);
                setRequests({'ERROR': data['ERROR']});
            } else {
                setRequests(data['Result']);
                console.log(data['Result']);
            }
        }).catch(error => {
            console.log(error)
            setRequests({'ERROR': 'Error'});
        });
    }
    useEffect(() => {
        getRequests()
    }, [])
    if ('ERROR' in requests) {
        return (
            <div>
                <Navbar/>
                <h2>
                    An Error Occurred!
                </h2>
            </div>
        )
    } else {
        Object.keys(requests).forEach(key => {
            tables.push(<div>
                <RequestsTable tableData={requests[key]}/>
            </div>)
        })
        return (
            <div>
                <Navbar/>
                <div>
                    {tables}
                </div>
            </div>
        )
    }

}
export default Requests;