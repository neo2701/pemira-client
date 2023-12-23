export default defineNuxtRouteMiddleware(() => {
    useAlertStore().clear();
});
