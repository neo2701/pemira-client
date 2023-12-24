<script lang="ts" setup>
definePageMeta({
    layout: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(2);

const video = ref<HTMLVideoElement>();
const sources = ref<MediaDeviceInfo[]>([]);
const canvas = ref<HTMLCanvasElement>();
const deviceId = ref<string>();
const picture = ref();

const getDevices = async () => {
    if (!navigator.mediaDevices) {
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    sources.value = devices.filter((device) => device.kind === 'videoinput');
    deviceId.value = sources.value[0].deviceId;
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
    if (electionStore.verificationPicture === undefined) {
        navigateTo('/election/1');
    }

    getDevices();
});

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
                <UiCardTitle>Foto KTM</UiCardTitle>
                <UiCardDescription>
                    Pastikan ktm terlihat jelas dan tidak blur
                </UiCardDescription>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <template v-if="picture">
                    <UiButton
                        :disabled="!deviceId"
                        variant="outline"
                        @click="() => (picture = undefined)"
                    >
                        Ulangi Pengambilan Foto
                    </UiButton>
                    <ConfirmationDialog
                        title="Apakah kamu yakin?"
                        description="Pastikan foto ktm terlihat jelas dan tidak blur karena akan digunakan untuk verifikasi pemilihanmu."
                        @confirm="next"
                    >
                        <UiButton :disabled="!deviceId"> Selanjutnya </UiButton>
                    </ConfirmationDialog>
                </template>
                <UiButton v-else :disabled="!deviceId" @click="capture">
                    Ambil Foto
                </UiButton>
            </UiCardFooter>
            <UiCardContent class="flex items-center">
                <UiSelect v-model="deviceId">
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
                    class="relative lg:max-w-2xl xl:max-w-3xl mx-auto rounded-lg overflow-hidden"
                >
                    <UiAspectRatio
                        v-show="picture"
                        :ratio="16 / 9"
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
                </div>
            </UiCardContent>
        </UiCard>
    </NuxtLayout>
</template>
