import axios from "axios";
import {server} from "../config/data";

export const retrieveRequests = (cookies) => {
    return axios.get(server + 'get_requests', {
        params:
            {
                cookies
            }
    });
};
export const acceptRequest = (formId, cookies) => {
    return axios.get(server + 'accept_form/', {
        params: {
            formId: formId,
            cookies: cookies
        }
    });
};
export const rejectRequest = (formId, cookies) => {
    return axios.get(server + 'reject_form/', {
        params: {
            formId: formId,
            cookies: cookies
        }
    });
};
