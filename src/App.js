import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {Route, BrowserRouter as Router, Routes, Redirect, useNavigate} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import UseToken from "./components/UseToken";
import {createContext, useContext, useEffect, useState} from "react";
import Elections from "./components/Elections";
import Profile from "./components/Profile";
import TokenContext from "./components/TokenContext";
import Results from "./components/Results";
import Requests from "./components/Requests";
import VerifyAuth from "./components/VerifyAuth";


const App = (props) => {
    let {token, setToken} = useContext(TokenContext)
    // if (!token) {
    //     return (
    //         <tokenContext.provider value={{token, setToken}}>
    //             <Login/>
    //         </tokenContext.provider>)
    // } else {
    return (
        <div>
            {/*{!token ? <Login/> :*/}
            <Routes>
                <Route path="/login" element={<VerifyAuth><Login/></VerifyAuth>}/>
                <Route path="/elections" element={<VerifyAuth><Elections/></VerifyAuth>}/>
                <Route path="/profile" element={<VerifyAuth><Profile/></VerifyAuth>}/>
                <Route path="/results" element={<VerifyAuth><Results/></VerifyAuth>}/>
                <Route path="/requests" element={<VerifyAuth><Requests/></VerifyAuth>}/>
                <Route path="/home" element={<VerifyAuth><Home/></VerifyAuth>}/>
                <Route path='/' element={<Home/>}/>
            </Routes>
            {/*}*/}
        </div>
    )
    // }
}


export default App
