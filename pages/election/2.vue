<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(2);

const video = ref<HTMLVideoElement>();
const videoStream = ref<MediaStream>();
const sources = ref<MediaDeviceInfo[]>([]);
const canvas = ref<HTMLCanvasElement>();
const picture = ref();
const portrait = ref(false);

const back = () => {
    navigateTo('/election/1');
};

const getDevices = async () => {
    if (!navigator.mediaDevices) {
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    sources.value = devices.filter((device) => device.kind === 'videoinput');

    if (sources.value.length === 0) {
        return;
    }

    if (electionStore.deviceId === undefined) {
        electionStore.deviceId = sources.value[0].deviceId;
    }
};

const stopCamera = () => {
    if (videoStream.value) {
        videoStream.value.getTracks().forEach((track) => {
            track.stop();
        });
    }
};

const startCamera = (id?: string) => {
    navigator.mediaDevices
        .getUserMedia({
            video: {
                deviceId: id,
                aspectRatio: 16 / 9,
                facingMode: 'user',
            },
            audio: false,
        })
        .then((stream) => {
            videoStream.value = stream;
            video.value!.srcObject = stream;
            video.value!.play();
        })
        .catch((err) => {
            console.error(err);
        });
};

const capture = () => {
    if (!video.value || !video.value.srcObject) {
        return;
    }

    const context = canvas.value!.getContext('2d')!;

    canvas.value!.width = video.value.videoWidth;
    canvas.value!.height = video.value.videoHeight;

    context.drawImage(
        video.value,
        0,
        0,
        video.value.videoWidth,
        video.value.videoHeight,
    );

    const data = canvas.value!.toDataURL('image/png');
    picture.value = data;
};

const next = () => {
    electionStore.setKtmPicture(picture.value);
    navigateTo('/election/3');
};

onMounted(() => {
    video.value!.addEventListener('loadedmetadata', () => {
        console.log(video.value!.videoWidth, video.value!.videoHeight);
        portrait.value = video.value!.videoWidth < video.value!.videoHeight;
    });

    startCamera(electionStore.deviceId);
    getDevices();
});

onUnmounted(() => {
    stopCamera();
});

watch(
    () => electionStore.deviceId,
    async () => {
        if (!navigator.mediaDevices || video.value === undefined) {
            return;
        }

        startCamera(electionStore.deviceId);
    },
);
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="flex items-center">
                <UiCardTitle>Foto KTM</UiCardTitle>
                <UiCardDescription>
                    Pastikan foto ktm terlihat jelas dan tidak blur
                </UiCardDescription>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <template v-if="picture">
                    <UiButton
                        size="lg"
                        :disabled="!electionStore.deviceId"
                        variant="outline"
                        @click="() => (picture = undefined)"
                    >
                        Ulangi
                    </UiButton>
                    <ConfirmationDialog
                        title="Apakah kamu yakin?"
                        description="Pastikan ktm terlihat jelas dan tidak blur karena akan digunakan untuk verifikasi pemilihanmu."
                        @confirm="next"
                    >
                        <UiButton size="lg" :disabled="!electionStore.deviceId">
                            Selanjutnya
                        </UiButton>
                    </ConfirmationDialog>
                </template>
                <template v-else>
                    <UiButton size="lg" variant="outline" @click="back">
                        Kembali
                    </UiButton>
                    <UiButton
                        :disabled="!electionStore.deviceId"
                        size="lg"
                        @click="capture"
                    >
                        Ambil Foto
                    </UiButton>
                </template>
            </UiCardFooter>
            <UiCardContent class="flex items-center">
                <UiSelect v-model="electionStore.deviceId">
                    <UiSelectTrigger class="mx-auto max-w-sm">
                        <UiSelectValue
                            placeholder="Pilih Perangkat"
                            class="select-none"
                        />
                    </UiSelectTrigger>
                    <UiSelectContent>
                        <UiSelectGroup>
                            <UiSelectItem
                                v-for="source in sources"
                                :value="source.deviceId"
                            >
                                {{ source.label }}
                            </UiSelectItem>
                        </UiSelectGroup>
                    </UiSelectContent>
                </UiSelect>
            </UiCardContent>
            <UiCardContent>
                <div
                    class="relative lg:max-w-2xl xl:max-w-3xl mx-auto border-4 rounded-lg overflow-hidden"
                >
                    <UiAspectRatio
                        v-show="picture"
                        :ratio="portrait ? 9 / 16 : 16 / 9"
                        class="flex"
                    >
                        <canvas
                            ref="canvas"
                            class="w-full h-full bg-green-400"
                        ></canvas>
                    </UiAspectRatio>
                    <video
                        v-show="!picture"
                        ref="video"
                        autoplay="true"
                        muted="true"
                        playsinline="true"
                        class="w-full h-auto object-cover"
                    ></video>
                    <div
                        v-if="!picture"
                        class="absolute top-0 right-0 flex gap-2 items-center text-white text-xs font-medium p-4 animate-pulse"
                    >
                        <div>Recording</div>
                        <span
                            class="w-4 h-4 bg-red-400 border border-white rounded-full"
                        ></span>
                    </div>
                    <div
                        v-if="portrait"
                        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 border-4 border-dashed rounded-lg opacity-50"
                    >
                        <UiAspectRatio :ratio="10 / 17"></UiAspectRatio>
                    </div>
                    <div
                        v-else
                        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 border-4 border-dashed rounded-lg opacity-50"
                    >
                        <UiAspectRatio :ratio="17 / 10"></UiAspectRatio>
                    </div>
                </div>
            </UiCardContent>
        </UiCard>
    </NuxtLayout>
</template>
