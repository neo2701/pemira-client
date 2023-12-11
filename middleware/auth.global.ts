export default defineNuxtRouteMiddleware((to, from) => {
    const loginPath = from.fullPath.includes('/admin')
        ? '/admin/login'
        : '/login';

    const allowedPaths = ['/login', '/authenticate', '/admin/login'];

    if (allowedPaths.includes(to.path)) {
        return;
    }

    const user = useAuth().user();

    if (!user) {
        return navigateTo(loginPath);
    }
});
