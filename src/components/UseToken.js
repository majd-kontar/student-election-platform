import {createContext, useState} from 'react';


const UseToken = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        if (userToken == null) {
            localStorage.removeItem('token');
            setToken(null);
        } else {
            localStorage.setItem('token', JSON.stringify(userToken));
            setToken(JSON.stringify(userToken))
        }
    };

    return [token, saveToken]
}

export default UseToken;