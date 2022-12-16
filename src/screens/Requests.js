import Navbar from "../components/Navbar";
import axios from "axios";
import {useEffect, useState} from "react";
import RequestsTable from "../components/RequestsTable";
import {retrieveRequests} from "../requests/requests";
import {useCookies} from "react-cookie";

const Requests = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    let [requests, setRequests] = useState({})
    let tables = []

    const getRequests = async () => {
        retrieveRequests(cookies).then((response) => {
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
                <h1 className='Error'>
                    An Error Occurred!
                </h1>
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