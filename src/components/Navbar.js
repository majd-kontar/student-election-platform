import "./Navbar.css"
import {useHistory} from "react-router-dom";


const Navbar = (props) => {
    const history = useHistory();
    return (
        <div className="navbar">
            <button onClick={() => {
                history.push('/elections')
            }}>Elections
            </button>
            <button onClick={() => {
                history.push('/results')
            }}>Results
            </button>
            <button onClick={() => {
                history.push('/profile')
            }}>Profile
            </button>
            <button>Logout</button>
        </div>
    )
}

export default Navbar;