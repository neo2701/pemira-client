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
