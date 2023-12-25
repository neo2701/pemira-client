<script lang="ts" setup>
const config = useRuntimeConfig();
const route = useRoute();

const ballot = ref<Ballot>();
const loading = ref(false);
const storageUrl = config.public.apiBase + '/../storage/';
const done = ref(false);

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

onMounted(getNext);
</script>

<template>
    <UiCard
        class="relative grow flex flex-col justify-center border-0 text-center"
    >
        <UiCardHeader>
            <UiCardTitle class="text-2xl">Pengesahan Surat Suara</UiCardTitle>
            <UiCardDescription>
                <template v-if="done">Selesai</template>
                <template v-else>NPM: {{ ballot?.npm }}</template>
            </UiCardDescription>
        </UiCardHeader>
        <UiCardFooter v-if="done" class="gap-2 justify-center">
            <NuxtLink :to="`/admin/events/${route.params.event}/dashboard`">
                <UiButton variant="outline">Kembali ke Dashboard</UiButton>
            </NuxtLink>
            <NuxtLink :to="`/admin/events/${route.params.event}/result`">
                <UiButton>Tampilkan Hasil Pengesahan</UiButton>
            </NuxtLink>
        </UiCardFooter>
        <UiCardContent v-else>
            <Icon v-if="loading" name="svg-spinners:ring-resize" size="24" />
            <template v-if="ballot && !loading">
                <div class="grid grid-cols-2 gap-4">
                    <img
                        :src="storageUrl + ballot?.verification_picture"
                        class="w-full rounded-lg"
                    />
                    <img
                        :src="storageUrl + ballot?.ktm_picture"
                        class="w-full rounded-lg"
                    />
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
