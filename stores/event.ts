import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useEventStore = defineStore('event', () => {
    const event = ref<Event | null>(null);
    const division = ref<Division | null>(null);
    const errorMessage = ref<string>('');

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
        try {
            const { data, statusCode } = await useApiFetch(`/events/${id}`);
            if (statusCode.value === 404) {
                errorMessage.value = 'Event not found.';
                return;
            }
            if (statusCode.value !== 200) {
                errorMessage.value = `Unexpected error: ${statusCode.value}`;
                return;
            }
            event.value = data.value;
        } catch (err) {
            console.error('Error fetching event:', err);
            errorMessage.value = 'Failed to fetch event data.';
        }
    };

    const set = (newEvent: Event) => {
        event.value = newEvent;
    };

    const getDivision = async (id: string | number) => {
        if (!event.value?.id) {
            errorMessage.value = 'No event selected.';
            return;
        }
        try {
            const { data, error } = await useApiFetch(
                `/events/${event.value.id}/divisions/${id}`,
            );
            if (error.value) {
                errorMessage.value = `Failed to fetch division: ${error.value.message}`;
                return;
            }
            division.value = data.value;
        } catch (err) {
            console.error('Error fetching division:', err);
            errorMessage.value = 'Failed to fetch division data.';
        }
    };

    const openElection = async () => {
        if (!event.value?.id) {
            errorMessage.value = 'No event selected.';
            return false;
        }

        if (event.value?.is_open) {
            errorMessage.value = 'Election is already open.';
            return false;
        }

        try {
            const { error } = await useApiFetch(
                `/events/${event.value.id}/open`,
                {
                    method: 'POST',
                },
            );

            if (error.value) {
                errorMessage.value = `Failed to open election: ${error.value.message}`;
                return false;
            }

            errorMessage.value = '';
            await get(event.value.id);
            return true;
        } catch (err) {
            console.error('Error opening election:', err);
            errorMessage.value = 'Failed to open election.';
            return false;
        }
    };

    const closeElection = async () => {
        if (!event.value?.id) {
            errorMessage.value = 'No event selected.';
            return false;
        }

        if (!event.value?.is_open) {
            errorMessage.value = 'Election is already closed.';
            return false;
        }

        try {
            const { error } = await useApiFetch(
                `/events/${event.value.id}/close`,
                {
                    method: 'POST',
                },
            );

            if (error.value) {
                errorMessage.value = `Failed to close election: ${error.value.message}`;
                return false;
            }

            errorMessage.value = '';
            await get(event.value.id);
            return true;
        } catch (err) {
            console.error('Error closing election:', err);
            errorMessage.value = 'Failed to close election.';
            return false;
        }
    };

    return {
        event,
        division,
        status, // status is now a boolean (true = open, false = closed)
        errorMessage,
        get,
        set,
        getDivision,
        openElection,
        closeElection,
    };
});
