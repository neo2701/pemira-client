export const usePemiraConfig = () => {
    const config = useRuntimeConfig();

    return {
        year: computed(() => config.public.year || '2025'),
        apiBase: computed(() => config.public.apiBase),
        googleClientId: computed(() => config.public.googleClientId),
        build: computed(() => config.public.build),
    };
};
