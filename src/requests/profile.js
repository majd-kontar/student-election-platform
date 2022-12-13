import axios from "axios";
import {server} from "../config/data";

export const signin = (username, password) => {
    return axios.get('http://localhost:3002/login', {
        params: {
            username: username,
            password: password
        }
    });
};
export const signup = (firstName, lastName, username, studentEmail, password) => {
    return axios.post('http://localhost:3002/register', {
        firstName: firstName,
        lastName: lastName,
        username: username,
        studentEmail: studentEmail,
        studentPassword: password,
    });
};
export const getProfile = (cookies) => {
    return axios.get(server + 'get_profile', {
        params:
            {
                cookies
            }
    })
}
export const updateProfile = (school, major, cls, campus, address, phoneNb, password, studentRecoveryEmail, cookies) => {
    return axios.put(server + 'update_profile', {
        school: school,
        major: major,
        cls: cls,
        campus: campus,
        address: address,
        phoneNb: phoneNb,
        studentPassword: password,
        studentRecoveryEmail: studentRecoveryEmail,
        cookies: cookies
    })
}