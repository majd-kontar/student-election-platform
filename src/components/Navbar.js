import "./Navbar.css"
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import TokenContext from "./TokenContext";


const Navbar = (props) => {
    const navigate = useNavigate();
    let {token, setToken}=useContext(TokenContext)
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
                navigate('/profile')
            }}>Profile
            </button>
            <button onClick={() => {
                setToken(null);
            }}>Logout
            </button>
        </div>
    )
}

export default Navbar;