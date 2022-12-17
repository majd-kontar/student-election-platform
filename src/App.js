import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {Route, BrowserRouter as Router, Routes, Redirect, useNavigate} from "react-router-dom";
import Login from "./screens/Login";
import Elections from "./screens/Elections";
import Profile from "./screens/Profile";
import Results from "./screens/Results";
import Requests from "./screens/Requests";
import {useCookies} from "react-cookie";


const App = (props) => {
    const [cookies, setCookie] = useCookies(["access-token"]);
    if (!cookies["access-token"]) {
        return (
            <Login/>)
    } else {
        return (
            <div>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/elections" element={<Elections/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/results" element={<Results/>}/>
                    <Route path="/requests" element={<Requests/>}/>
                    <Route path='/' element={<Login/>}/>
                </Routes>
            </div>
        )
    }
};


export default App;
