type Session = {
    user: User | null;
};

type User = {
    npm: string;
    email: string;
    name: string;
    picture: string;
    role: number;
};

interface Event {
    id: number;
    title: string;
    description: string;
    logo: string;
    open_election_at: string;
    close_election_at: string;
}

interface Whitelist {
    id: number;
    event_id: number;
    npm: number;
}

interface Division {
    id: number;
    name: string;
    candidates_count: number;
}

interface Candidate {
    id: number;
    division_id: number;
    first: string;
    first_name: string;
    second: string;
    second_name: string;
    vision: string;
    mission: string;
    picture: string;
    order: number;
    votes_count?: number;
}

interface Ballot {
    id: number;
    event_id: number;
    npm: string;
    ktm_picture: string;
    verification_picture: string;
    accepted: boolean;
    accepted_at: string;
    accepted_by: number;
    created_at: string;
    user?: User;
}

interface BallotDetail {
    division_id: number;
    candidate_id: number;
    division: Division;
    candidate: Candidate;
}
