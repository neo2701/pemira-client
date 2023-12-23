export const useEventStore = defineStore('event', () => {
    const event = ref<Event>();
    const division = ref<Division>();
    const status = computed(() => {
        if (!event.value) {
            return 0;
        }

        if (
            event.value?.open_election_at !== null &&
            event.value?.close_election_at === null
        ) {
            return 1;
        }

        if (
            event.value?.open_election_at !== null &&
            event.value?.close_election_at !== null
        ) {
            return 2;
        }

        return 0;
    });

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

    const openElection = async () => {
        if (!event.value) return false;

        const { error } = await useApiFetch(`/events/${event.value?.id}/open`, {
            method: 'POST',
        });

        if (error.value) return false;

        await get(event.value?.id);

        return true;
    };

    const closeElection = async () => {
        if (!event.value) return false;

        const { error } = await useApiFetch(
            `/events/${event.value?.id}/close`,
            {
                method: 'POST',
            },
        );

        if (error.value) return false;

        await get(event.value?.id);

        return true;
    };

    return {
        event,
        status,
        division,
        get,
        set,
        getDivision,
        openElection,
        closeElection,
    };
});
