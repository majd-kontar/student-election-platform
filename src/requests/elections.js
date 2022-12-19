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
export const submitCandidateForm = (electionID, position, program, cookies) => {
    return axios.post(server + 'submit_candidate_form', {
        electionID: electionID,
        position: position,
        program: program,
        cookies: cookies
    });
};
export const submitVoteForm = (type, candidateUsername, clubVote, electionID, cookies) => {
    return axios.post(server + 'submit_vote_form', {
            electionType: type,
            vote: candidateUsername,
            clubVote: clubVote,
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
export const retrieveCouncilResults = (cookies) => {
    return axios.post(server + 'store_council_results', {
        cookies
    })
        ;
};
export const retrieveRepResults = (cookies) => {
    return axios.post(server + 'store_rep_results', {
        cookies
    })
        ;
};