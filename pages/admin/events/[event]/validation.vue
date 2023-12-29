<script lang="ts" setup>
const config = useRuntimeConfig();
const route = useRoute();

const ballot = ref<Ballot>();
const loading = ref(false);
const storageUrl = config.public.apiBase + '/../storage/';
const done = ref(false);
const ktm = ref<HTMLImageElement>();
const verification = ref<HTMLImageElement>();
const result = reactive({
    accepted: 0,
    rejected: 0,
});

const getCurrentResult = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/result/overall`,
    );

    loading.value = false;

    if (error.value) {
        return;
    }

    result.accepted = data.value.accepted_ballots_count;
    result.rejected = data.value.rejected_ballots_count;
};

const getNext = async () => {
    loading.value = true;

    const { data, error, statusCode } = await useApiFetch(
        `/events/${route.params.event}/ballots/next`,
    );

    loading.value = false;

    if (error.value && statusCode.value !== 404) {
        return;
    }

    await getCurrentResult();

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

const setHeight = (e: any) => {
    if (!isPortrait(e.target)) {
        return;
    }

    const target = e.currentTarget;
    const naturalHeight = target.parentNode.clientHeight;

    const style = `width: auto; height: ${naturalHeight}px`;

    target.setAttribute('style', style);
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
    const style = `transform:rotate(-90deg) translateY(${yshift}%) scale(${scale}); transform-origin: top right;`;

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
    <UiCard class="relative grow flex flex-col border-0 text-center">
        <div class="flex justify-center gap-4 p-4">
            <UiCard class="max-w-xs w-full bg-red-50 text-red-950">
                <UiCardHeader>
                    <UiCardTitle class="text-4xl font-bold">
                        {{ result.rejected }}
                    </UiCardTitle>
                    <UiCardDescription class="text-red-950 font-medium">
                        Tidak Sah
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
            <UiCardHeader>
                <UiCardTitle class="text-2xl">Validasi Surat Suara</UiCardTitle>
                <UiCardDescription>
                    <template v-if="done">Selesai</template>
                    <template v-else>
                        {{ ballot?.npm }} - {{ ballot?.user?.name }}
                    </template>
                </UiCardDescription>
            </UiCardHeader>
            <UiCard class="max-w-xs w-full bg-green-50 text-green-950">
                <UiCardHeader>
                    <UiCardTitle class="text-4xl font-bold">
                        {{ result.accepted }}
                    </UiCardTitle>
                    <UiCardDescription class="text-green-950 font-medium">
                        Sah
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
        </div>
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
            <div v-if="ballot && !loading" class="grid gap-4">
                <div class="grid grid-cols-2 gap-4">
                    <UiAspectRatio :ratio="16 / 9">
                        <img
                            :src="storageUrl + ballot?.verification_picture"
                            class="w-full rounded-lg"
                        />
                    </UiAspectRatio>
                    <UiAspectRatio :ratio="16 / 9">
                        <img
                            :src="storageUrl + ballot?.ktm_picture"
                            class="w-full rounded-lg"
                            @load="setLandscape"
                        />
                    </UiAspectRatio>
                </div>
            </div>
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
