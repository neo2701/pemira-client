export default defineNuxtRouteMiddleware((to, from) => {
    const loginPath = from.fullPath.includes('/admin')
        ? '/admin/login'
        : '/login';

    if (to.path === '/login' || to.path === '/admin/login') {
        return;
    }

    const user = useAuth().user();

    if (!user) {
        return navigateTo(loginPath);
    }
});
