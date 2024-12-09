import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useElectionStore = defineStore('election', () => {
    const event = ref<Event | null>(null);
    const progress = ref(0);
    const deviceId = ref<string | undefined>();
    const verificationPicture = ref<Blob | null>(null);
    const ktmPicture = ref<Blob | null>(null);
    const ballots = ref<Record<string, BallotDetail>>({});

    const checkUserStatus = async () => {
        if (!event.value) return false;

        const { error } = await useApiFetch(
            `/events/${event.value.id}/ballots/user`,
        );
        return !error.value;
    };

    const getEvent = async (id: number) => {
        const { data, error } = await useApiFetch(`/events/${id}`);
        if (!error.value) {
            event.value = data.value;
        } else {
            // Tangani error sesuai kebutuhan aplikasi, misalnya dengan alert
        }
    };

    const setProgress = (page: number) => {
        progress.value = page * (100 / 7); // Mengasumsikan total 7 halaman
    };

    const dataUrlToBlob = (dataUrl: string): Blob => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
    };

    const setVerificationPicture = (dataUrl: string) => {
        verificationPicture.value = dataUrlToBlob(dataUrl);
    };

    const setKtmPicture = (dataUrl: string) => {
        ktmPicture.value = dataUrlToBlob(dataUrl);
    };

    return {
        event,
        progress,
        deviceId,
        verificationPicture,
        ktmPicture,
        ballots,
        getEvent,
        setProgress,
        setVerificationPicture,
        setKtmPicture,
        checkUserStatus,
    };
});
