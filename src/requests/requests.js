import axios from "axios";
import {server} from "../config/data";
import decode from "../functions/DecodeToken";

export const retrieveRequests = (cookies) => {
    if (decode(cookies)['admin']) {
        return axios.get(server + 'get_requests', {
            params:
                {
                    cookies
                }
        });
    }else {
        return axios.get(server + 'get_requests_by_id', {
            params:
                {
                    cookies
                }
        });
    }
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
