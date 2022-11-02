import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from "./components/Login";
import Home from "./components/Home";
import {useState} from "react";


const App = (props) => {
    const [token, setToken] = useState();
    // if (!token) {
    //     return <Login setToken={setToken}/>
    // }
    return (
        <div className="wrapper">
            <Home/>
        </div>
    )
}

export default App
