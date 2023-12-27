<script lang="ts" setup>
const config = useRuntimeConfig();
const route = useRoute();

const ballot = ref<Ballot>();
const loading = ref(false);
const storageUrl = config.public.apiBase + '/../storage/';
const done = ref(false);
const ktm = ref<HTMLImageElement>();
const verification = ref<HTMLImageElement>();

const getNext = async () => {
    loading.value = true;

    const { data, error, statusCode } = await useApiFetch(
        `/events/${route.params.event}/ballots/next`,
    );

    loading.value = false;

    if (error.value && statusCode.value !== 404) {
        return;
    }

    if (statusCode.value === 404) {
        ballot.value = undefined;
        done.value = true;
        return;
    }

    ballot.value = data.value;
};

const accept = async () => {
    loading.value = true;

    const { error } = await useApiFetch(
        `/events/${route.params.event}/ballots/${ballot.value?.id}/accept`,
        {
            method: 'POST',
        },
    );

    loading.value = false;

    if (error.value) {
        return;
    }

    await getNext();
};

const reject = async () => {
    loading.value = true;

    const { error } = await useApiFetch(
        `/events/${route.params.event}/ballots/${ballot.value?.id}/reject`,
        {
            method: 'POST',
        },
    );

    loading.value = false;

    if (error.value) {
        return;
    }

    await getNext();
};

const isPortrait = (e: HTMLImageElement) => {
    const naturalWidth = e.naturalWidth;
    const naturalHeight = e.naturalHeight;

    return naturalWidth < naturalHeight;
};

const setLandscape = (e: any) => {
    if (!isPortrait(e.target)) {
        return;
    }

    const target = e.currentTarget;
    const naturalWidth = target.parentNode.clientWidth;
    const naturalHeight = target.parentNode.clientHeight;

    const scale =
        naturalWidth > naturalHeight ? naturalHeight / naturalWidth : 1;
    const yshift = -100 * scale;
    const style = `transform:rotate(90deg) translateY(${yshift}%) scale(${scale}); transform-origin: top left;`;

    target.setAttribute('style', style);
};

onMounted(() => {
    getNext();

    if (!ktm.value || !verification.value) {
        return;
    }
});
</script>

<template>
    <UiCard
        class="relative grow flex flex-col justify-center border-0 text-center"
    >
        <UiCardHeader>
            <UiCardTitle class="text-2xl">Validasi Surat Suara</UiCardTitle>
            <UiCardDescription>
                <template v-if="done">Selesai</template>
                <template v-else>
                    {{ ballot?.npm }} - {{ ballot?.user?.name }}
                </template>
            </UiCardDescription>
        </UiCardHeader>
        <UiCardFooter v-if="done" class="gap-2 justify-center">
            <NuxtLink :to="`/admin/events/${route.params.event}/dashboard`">
                <UiButton variant="outline">Kembali ke Dashboard</UiButton>
            </NuxtLink>
            <NuxtLink :to="`/admin/events/${route.params.event}/result`">
                <UiButton>Tampilkan Hasil Validasi</UiButton>
            </NuxtLink>
        </UiCardFooter>
        <UiCardContent v-else>
            <Icon v-if="loading" name="svg-spinners:ring-resize" size="24" />
            <template v-if="ballot && !loading">
                <div class="grid grid-cols-2 gap-4">
                    <UiAspectRatio :ratio="16 / 9">
                        <img
                            :src="storageUrl + ballot?.verification_picture"
                            class="w-full rounded-lg"
                            @load="setLandscape"
                        />
                    </UiAspectRatio>
                    <UiAspectRatio :ratio="16 / 9">
                        <img
                            :src="storageUrl + ballot?.ktm_picture"
                            class="w-full rounded-lg -rotate-90"
                            @load="setLandscape"
                        />
                    </UiAspectRatio>
                </div>
            </template>
        </UiCardContent>
        <template v-if="!done && !loading && ballot">
            <div
                class="absolute top-0 left-0 w-2/5 h-full flex items-center justify-center text-xl text-white font-bold opacity-0 cursor-pointer select-none transition hover:opacity-100 hover:bg-gradient-to-r from-red-600 via-red-500 to-transparent"
                @click="reject"
            >
                Tidak Sah
            </div>
            <div
                class="absolute top-0 right-0 w-2/5 h-full flex items-center justify-center text-xl text-white font-bold opacity-0 cursor-pointer select-none transition hover:opacity-100 hover:bg-gradient-to-r from-transparent via-green-500 to-green-600"
                @click="accept"
            >
                Sah
            </div>
        </template>
    </UiCard>
</template>
