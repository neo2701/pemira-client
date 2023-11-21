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
