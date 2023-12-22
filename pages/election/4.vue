<script lang="ts" setup>
definePageMeta({
    layout: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(4);

const video = ref<HTMLVideoElement>();
const sources = ref<MediaDeviceInfo[]>([]);
const deviceId = ref<string>();
const photo = ref();

const getDevices = async () => {
    if (!navigator.mediaDevices) {
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    sources.value = devices.filter((device) => device.kind === 'videoinput');
    deviceId.value = sources.value[0].deviceId;
};

onMounted(getDevices);

watch(deviceId, async (newDeviceId) => {
    if (!navigator.mediaDevices || video.value === undefined) {
        return;
    }

    navigator.mediaDevices
        .getUserMedia({
            video: {
                deviceId: newDeviceId,
                aspectRatio: 16 / 9,
            },
            audio: false,
        })
        .then((stream) => {
            video.value!.srcObject = stream;
            video.value!.play();
        })
        .catch((err) => {
            console.error(err);
        });
});
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="flex items-center">
                <UiCardTitle>BLJ Angkatan 2022</UiCardTitle>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <UiButton variant="outline" @click="navigateTo('/election/3')">
                    Kembali
                </UiButton>
                <UiButton @click="() => navigateTo('/election/5')">
                    Selanjutnya
                </UiButton>
            </UiCardFooter>
        </UiCard>
    </NuxtLayout>
</template>
