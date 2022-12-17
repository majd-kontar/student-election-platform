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
export const submitVoteForm = (candidateUsername, electionID, cookies) => {
    return axios.post(server + 'submit_vote_form', {
            // userId: token,
            vote: candidateUsername,
            electionId: electionID,
            cookies: cookies
        }
    )
}
export const submitCreateElectionForm = (type, campus, club, major, endDate, cookies) => {
    return axios.post(server + 'create_election', {
            type: type,
            campus: campus,
            club: club,
            major: major,
            endDate: endDate,
            cookies: cookies
        }
    )
}
export const retrieveResults = (cookies) => {
    return axios.get(server + 'get_results', {
        params:
            {
                cookies
            }
    });
};