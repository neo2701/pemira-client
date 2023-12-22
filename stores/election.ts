export const useElectionStore = defineStore('election', () => {
    const progress = ref(0);
    const verificationPicture = ref();
    const ktmPicture = ref();

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
        progress,
        verificationPicture,
        ktmPicture,
        setProgress,
        setVerificationPicture,
        setKtmPicture,
    };
});
