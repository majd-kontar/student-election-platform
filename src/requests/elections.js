import axios from "axios";
import {server} from "../config/data";

export const retrieveElections = (cookies) => {
    return axios.get(server + 'get_elections', {
        params:
            {
                cookies
            }
    });
};
export const retrieveCandidates = (electionID, cookies) => {
    return axios.get(server + 'get_candidates_by_election_id', {
        params: {
            electionID: electionID,
            cookies: cookies
        }
    });
};
export const submitCandidateForm = (position, program, cookies) => {
    return axios.put(server + 'submit_candidate_form', {
        position: position,
        program: program,
        cookies: cookies
    });
};
export const submitVoteForm = (candidateUsernmae, electionID, cookies) => {
    return axios.post(server + 'submit_vote_form', {
            // userId: token,
            vote: candidateUsernmae,
            electionId: electionID,
            cookies: cookies
        }
    )
}