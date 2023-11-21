export default defineNuxtRouteMiddleware((to, from) => {
    const user = useAuth().user();

    if (!user) {
        return navigateTo('/login');
    }
});
