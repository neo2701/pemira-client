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
const enlargedImage = ref<string | null>(null);

const viewEnlarged = (imageUrl: string) => {
    enlargedImage.value = imageUrl;
};

const closeEnlarged = () => {
    enlargedImage.value = null;
};

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

const getPrevious = async () => {
    loading.value = true;

    const endpoint =
        ballot.value === undefined
            ? `/events/${route.params.event}/ballots/latest-ballot`
            : `/events/${route.params.event}/ballots/${ballot.value?.id}/previous`;

    const { data, error, statusCode } = await useApiFetch(endpoint);

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
    done.value = false;
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
    <UiCard
        class="relative grow flex flex-col border-0 text-center bg-transparent"
    >
        <div class="flex justify-center gap-4 p-4">
            <div class="max-w-xs w-full">
                <UiCard class="bg-red-200 text-red-950">
                    <UiCardHeader>
                        <UiCardTitle class="text-4xl font-bold">
                            {{ result.rejected }}
                        </UiCardTitle>
                        <UiCardDescription class="text-red-950 font-medium">
                            Tidak Sah
                        </UiCardDescription>
                    </UiCardHeader>
                </UiCard>
            </div>
            <UiCardHeader>
                <UiCardTitle class="text-2xl text-white"
                    >Validasi Surat Suara</UiCardTitle
                >
                <UiCardDescription>
                    <template v-if="done">Selesai</template>
                    <template v-else>
                        <p class="text-white mt-2">
                            {{ ballot?.npm }} - {{ ballot?.user?.name }}
                        </p>
                    </template>
                </UiCardDescription>
                <UiCardFooter class="pb-0">
                    <UiButton
                        class="mx-auto"
                        variant="secondary"
                        @click="getPrevious"
                    >
                        Kembali
                    </UiButton>
                </UiCardFooter>
            </UiCardHeader>

            <div class="max-w-xs w-full">
                <UiCard class="bg-green-200 text-green-950">
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
        </div>
        <UiCardFooter v-if="done" class="gap-2 justify-center">
            <NuxtLink :to="`/admin/events/${route.params.event}/dashboard`">
                <UiButton variant="secondary">Kembali ke Dashboard</UiButton>
            </NuxtLink>
            <NuxtLink :to="`/admin/events/${route.params.event}/result`">
                <UiButton>Tampilkan Hasil Validasi</UiButton>
            </NuxtLink>
        </UiCardFooter>
        <UiCardContent v-else>
            <Icon v-if="loading" name="svg-spinners:ring-resize" size="24" />
            <div v-if="ballot && !loading" class="grid gap-4">
                <div class="grid grid-cols-2 gap-4 h-[calc(100vh-300px)]">
                    <div
                        class="flex items-center justify-center bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                        @click="
                            viewEnlarged(
                                storageUrl + ballot?.verification_picture,
                            )
                        "
                    >
                        <img
                            :src="storageUrl + ballot?.verification_picture"
                            class="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                    <div
                        class="flex items-center justify-center bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                        @click="viewEnlarged(storageUrl + ballot?.ktm_picture)"
                    >
                        <img
                            :src="storageUrl + ballot?.ktm_picture"
                            class="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </UiCardContent>
        <template v-if="!done && !loading && ballot">
            <div
                class="absolute top-0 left-0 w-[30%] h-full flex items-center justify-center text-xl text-white font-bold opacity-0 cursor-pointer select-none transition hover:opacity-100 hover:bg-gradient-to-r from-red-600 to-transparent"
                @click="reject"
            >
                Tidak Sah
            </div>
            <div
                class="absolute top-0 right-0 w-[30%] h-full flex items-center justify-center text-xl text-white font-bold opacity-0 cursor-pointer select-none transition hover:opacity-100 hover:bg-gradient-to-r from-transparent to-green-600"
                @click="accept"
            >
                Sah
            </div>
        </template>

        <!-- Enlarged Image Modal -->
        <div
            v-if="enlargedImage"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            @click="closeEnlarged"
        >
            <button
                class="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
                @click="closeEnlarged"
                aria-label="Close"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <img
                :src="enlargedImage"
                class="max-w-full max-h-full object-contain"
                @click.stop
            />
        </div>
    </UiCard>
</template>
