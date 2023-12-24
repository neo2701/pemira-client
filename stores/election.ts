export const useElectionStore = defineStore('election', () => {
    const event = ref<Event>({
        id: 1,
        title: '',
        description: '',
        logo: '',
        open_election_at: '',
        close_election_at: '',
    } as Event);
    const progress = ref(0);
    const verificationPicture = ref('1');
    const ktmPicture = ref('1');
    const ballots = reactive<Record<string, BallotDetail | null>>({
        '1': null,
        '2': null,
        '3': null,
        '4': null,
    });

    const getEvent = async (id: number) => {
        const { data, error } = await useApiFetch(`/events/${id}`);
        if (error.value) {
            return;
        }
        event.value = data.value;
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
        verificationPicture,
        ktmPicture,
        ballots,
        getEvent,
        setProgress,
        setVerificationPicture,
        setKtmPicture,
    };
});
