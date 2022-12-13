import "./Navbar.css"
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {useCookies} from "react-cookie";


const Navbar = (props) => {
    const [cookies, setCookie,removeCookie] = useCookies(["access-token"]);
    const navigate = useNavigate();
    return (
        <div className="navbar">
            <button onClick={() => {
                navigate('/elections')
            }}>Elections
            </button>
            <button onClick={() => {
                navigate('/results')
            }}>Results
            </button>
            <button onClick={() => {
                navigate('/requests')
            }}>Requests
            </button>
            <button onClick={() => {
                navigate('/profile')
            }}>Profile
            </button>
            <button onClick={() => {
                removeCookie('access-token');
                navigate('/')
            }}>Logout
            </button>
        </div>
    )
}

export default Navbar;