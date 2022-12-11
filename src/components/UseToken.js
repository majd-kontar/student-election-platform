import {createContext, useState} from 'react';


const UseToken = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('id');
        return JSON.parse(tokenString)

    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        if (userToken == null) {
            localStorage.removeItem('id');
            setToken(null);
        } else {
            localStorage.setItem('id', JSON.stringify(userToken));
            setToken(JSON.stringify(userToken))
        }
    };

    return [token, saveToken]
}

export default UseToken;