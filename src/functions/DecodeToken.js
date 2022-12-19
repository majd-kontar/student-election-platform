import {isExpired, decodeToken} from "react-jwt";

const decode = (cookie) => {
    return decodeToken(cookie['access-token']);
}
export default decode;