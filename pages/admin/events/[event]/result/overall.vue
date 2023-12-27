<script lang="ts" setup>
definePageMeta({
    middleware: 'result',
});

const route = useRoute();
const loading = ref(false);
const asPercentage = ref(false);

const counts = reactive({
    ballots: 0,
    accepted: 0,
    declined: 0,
});

const countsAsPercentage = computed(() => ({
    accepted: (counts.accepted / counts.ballots) * 100,
    declined: (counts.declined / counts.ballots) * 100,
}));

const getOverallResult = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/result/overall`,
    );

    loading.value = false;

    if (error.value) return;

    counts.ballots = data.value.ballots_count;
    counts.accepted = data.value.accepted_ballots_count;
    counts.declined = counts.ballots - counts.accepted;
};

const previous = () => {
    navigateTo(`/admin/events/${route.params.event}/result`);
};

const next = () => {
    navigateTo(`/admin/events/${route.params.event}/result/overview`);
};

onMounted(getOverallResult);
</script>

<template>
    <UiCard class="relative grow flex flex-col border-0 text-center">
        <UiCardHeader>
            <UiCardTitle class="text-2xl">Hasil Validasi</UiCardTitle>
            <UiCardDescription>PEMIRA 2024</UiCardDescription>
        </UiCardHeader>
        <UiCardFooter class="justify-center gap-2">
            <UiButton variant="outline" @click="previous">Kembali</UiButton>
            <UiButton @click="next">Selanjutnya</UiButton>
        </UiCardFooter>
        <UiCardContent>
            <div class="flex justify-center items-center gap-2">
                <UiSwitch @update:checked="(v) => (asPercentage = v)" />
                <UiLabel>Persentase</UiLabel>
            </div>
        </UiCardContent>
        <UiCardContent>
            <Icon
                v-if="loading"
                name="svg-spinners:ring-resize"
                size="24"
                class="mx-auto"
            />
            <template v-else>
                <div class="max-w-screen-lg mx-auto grid grid-cols-3 gap-4">
                    <UiCard>
                        <UiCardHeader>
                            <UiCardTitle class="text-2xl">
                                {{ counts.ballots }}
                            </UiCardTitle>
                            <UiCardDescription>Surat Suara</UiCardDescription>
                        </UiCardHeader>
                    </UiCard>
                    <UiCard>
                        <UiCardHeader>
                            <UiCardTitle class="text-2xl">
                                {{
                                    asPercentage
                                        ? countsAsPercentage.accepted + '%'
                                        : counts.accepted
                                }}
                            </UiCardTitle>
                            <UiCardDescription>
                                Surat Suara Sah
                            </UiCardDescription>
                        </UiCardHeader>
                    </UiCard>
                    <UiCard>
                        <UiCardHeader>
                            <UiCardTitle class="text-2xl">
                                {{
                                    asPercentage
                                        ? countsAsPercentage.declined + '%'
                                        : counts.declined
                                }}
                            </UiCardTitle>
                            <UiCardDescription>
                                Surat Suara Tidak Sah
                            </UiCardDescription>
                        </UiCardHeader>
                    </UiCard>
                    <div></div>
                    <UiCard>
                        <UiCardHeader>
                            <UiCardTitle>Perbandingan Surat Suara</UiCardTitle>
                            <UiCardDescription>
                                <EventResultPieChart
                                    :accepted="counts.accepted"
                                    :declined="counts.declined"
                                />
                            </UiCardDescription>
                        </UiCardHeader>
                    </UiCard>
                    <div></div>
                </div>
            </template>
        </UiCardContent>
    </UiCard>
</template>
