export const useEventStore = defineStore('event', () => {
    const event = ref<Event>();
    const division = ref<Division>();

    const get = async (id: string | string[] | number) => {
        const { data, statusCode } = await useApiFetch(`/events/${id}`);
        if (statusCode.value === 404) return navigateTo('/admin');
        event.value = data.value;
    };

    const set = (newEvent: Event) => {
        event.value = newEvent;
    };

    return { event, division, get, set };
});
