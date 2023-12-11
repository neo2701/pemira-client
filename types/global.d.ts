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
}
