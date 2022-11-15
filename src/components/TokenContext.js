import {createContext} from "react";
import UseToken from "./UseToken";

const TokenContext = createContext({});

export const TokenProvider = (props) => {
    const [token, setToken] = UseToken();
    return (
        <TokenContext.Provider
            value={{token, setToken}}>
            {props.children}
        </TokenContext.Provider>
    );
}

export default TokenContext;