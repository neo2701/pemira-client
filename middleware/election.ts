export default defineNuxtRouteMiddleware((to, from) => {
    const electionStore = useElectionStore();

    if (!electionStore.event) {
        return navigateTo('/');
    }
});
