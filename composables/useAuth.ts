export const useAuth = () => ({
    user(): User | null {
        const session = useSessionStorage('session', {
            user: null,
        } as Session);

        return session.value.user;
    },

    signIn(user: User) {
        const session = useSessionStorage('session', {
            user: null,
        } as Session);

        session.value.user = user;
    },

    signOut() {
        const session = useSessionStorage('session', {
            user: null,
        } as Session);

        session.value.user = null;
    },
});
