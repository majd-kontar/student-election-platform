import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import TokenContext from "./TokenContext";
import Login from "./Login";

const VerifyAuth = (props) => {
    let navigate = useNavigate();
    let {token, setToken} = useContext(TokenContext);
    if (!token && !window.location.href.endsWith('/login')) {
        return <Login/>
    } else {
        return (
            <div>
                {props.children}
            </div>)
    }
}
export default VerifyAuth;