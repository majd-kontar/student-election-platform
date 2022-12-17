import Requests from "./Requests";
import React, {Fragment, useEffect, useState} from 'react'
import "./Tables.css"
import {useCookies} from "react-cookie";
import decode from "./DecodeToken";
import Countdown from "react-countdown";

const ElectionsTable = (props) => {
    let tableData = props['tableData'];
    let type = props['type'];
    const [cookies, setCookie] = useCookies(["access-token"]);
    const admin = decode(cookies)['admin']
    let endTimes = [];
    let headers = [];
    let data = [];
    let isDisabled = false;
    let indexOfElectionID = 0;
    let indexOfEndTime = 0;


    tableData.forEach((value) => {
        data.push(Object.values(value))
    })
    for (let key in tableData[0]) {
        headers.push(key);
        if (key === 'electionID') {
            indexOfElectionID = headers.indexOf(key);
        }
        if (key === 'electionEndTime') {
            indexOfEndTime = headers.indexOf(key);
        }
    }
    tableData.map(value => {
        endTimes.push(value['electionEndTime'])
    })

    return (
        <table className="table">
            <thead>
            <tr>
                {headers.map((header) => (
                    <th>
                        {header}
                    </th>
                ))}
                {!admin &&
                <Fragment>
                    < th>
                        Vote
                    < /th>
                    <th>
                        Register
                    </th>
                </Fragment>}
            </tr>
            </thead>
            <tbody>{data.map((values, index) => (
                <tr>
                    {values.map((value, index) => (
                        index === indexOfEndTime ?
                            <td>
                                {value && Date.parse(value) > Date.now() ?
                                    <Countdown date={Date.parse(value)}/> :
                                    'Done!'}
                            </td>
                            :
                            <td>
                                {value}
                            </td>
                    ))}
                    {Date.parse(endTimes[index]) < Date.now() ?
                        isDisabled = true :
                        isDisabled = false}
                    {!admin &&
                    <Fragment>
                        <td>
                            <Requests type='vote' electionType={type} electionID={values[indexOfElectionID]}
                                      disabled={isDisabled}/>
                        </td>
                        <td>
                            <Requests type='register' electionType={type} electionID={values[indexOfElectionID]}
                                      disabled={isDisabled}/>
                        </td>
                    </Fragment>}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default ElectionsTable;