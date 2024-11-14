export const useElectionStore = defineStore('election', () => {
    const event = ref<Event>();
    const progress = ref(0);
    const deviceId = ref();
    const verificationPicture = ref();
    const ktmPicture = ref();
    const ballots = ref<Record<string, BallotDetail>>({});

    const checkUserStatus = async () => {
        if (!event.value) {
            return false;
        }

        const { error } = await useApiFetch(
            `/events/${event.value.id}/ballots/user`,
        );

        if (error.value) {
            return false;
        }

        return true;
    };

    const getEvent = async (id: number) => {
        const { data, error } = await useApiFetch(`/events/${id}`);
        if (error.value) {
            console.error('Error fetching event data:', error.value);
            return;
        }
        event.value = data.value;

        if (event.value) {
            console.log('Current event:', event.value);
        } else {
            console.error('Event data not available');
        }

        console.error('Error fetching event data:', error.value);
    };

    const setProgress = (page: number) => {
        progress.value = page * 14.285714285714285714285714285714;
    };

    const dataUrlToBlob = (dataUrl: string) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
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
