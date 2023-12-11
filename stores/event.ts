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

    const getDivision = async (id: string | number) => {
        const { data, error } = await useApiFetch(
            `/events/${event.value?.id}/divisions/${id}`,
        );
        division.value = data.value;
    };

    return { event, division, get, set, getDivision };
});
