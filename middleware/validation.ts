export default defineNuxtRouteMiddleware((to, from) => {
    const eventStore = useEventStore();

    if (!eventStore.event) {
        return navigateTo('/admin');
    }

    if (eventStore.status < 2) {
        return navigateTo(`/admin/events/${eventStore.event.id}/dashboard`);
    }
});
