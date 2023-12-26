export default defineNuxtRouteMiddleware((to, from) => {
    const validationStore = useValidationStore();

    if (!validationStore.result) {
        return navigateTo(`/admin/events/${to.params.event}/result`);
    }
});
