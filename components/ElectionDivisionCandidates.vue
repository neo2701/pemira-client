<script lang="ts" setup>
const props = defineProps<{
    divisionId: number;
    previous: string;
    next: string;
}>();

const electionStore = useElectionStore();

const division = ref<Division>();
const candidates = ref<Candidate[]>([]);
const loading = ref(false);

const selected = ref<Candidate>();

if (electionStore.ballots[props.divisionId]) {
    selected.value = electionStore.ballots[props.divisionId].candidate;
}

const getDivision = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${electionStore.event?.id}/divisions/${props.divisionId}`,
    );

    if (error.value) {
        return;
    }

    division.value = data.value;

    loading.value = false;
};

const getCandidates = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${electionStore.event?.id}/candidates?division_id=${props.divisionId}`,
    );

    if (error.value) {
        return;
    }

    candidates.value = data.value;
    loading.value = false;
};

const confirm = () => {
    if (!selected.value || !division.value) {
        return;
    }

    electionStore.ballots[props.divisionId] = {
        division_id: division.value.id,
        candidate_id: selected.value.id,
        division: division.value,
        candidate: selected.value,
    };

    navigateTo(`/election/${props.next}`);
};

onMounted(async () => {
    await getDivision();
    await getCandidates();
});
</script>

<template>
    <UiCard class="grow flex flex-col bg-transparent rounded-none">
        <UiCardHeader class="flex items-center">
            <div v-if="loading" class="flex justify-center">
                <Icon name="svg-spinners:ring-resize" size="32" />
            </div>
            <template v-else>
                <UiCardTitle>{{ division?.name }}</UiCardTitle>
                <UiCardDescription>
                    Pilih salah satu untuk melihat visi & misi
                </UiCardDescription>
            </template>
        </UiCardHeader>
        <template v-if="!loading">
            <UiCardFooter class="flex justify-center gap-4">
                <UiButton
                    size="lg"
                    variant="secondary"
                    @click="navigateTo(`/election/${$props.previous}`)"
                >
                    Kembali
                </UiButton>
                <ConfirmationDialog
                    v-if="selected"
                    title="Apakah kamu yakin?"
                    :description="`Pilih ${selected?.first_name} sebagai ${division?.name}`"
                    @confirm="confirm"
                >
                    <UiButton size="lg">Selanjutnya</UiButton>
                </ConfirmationDialog>
                <UiButton
                    v-else
                    size="lg"
                    variant="default"
                    disabled
                    class="border cursor-not-allowed disabled:hover:bg-primary"
                >
                    Selanjutnya
                </UiButton>
            </UiCardFooter>
            <UiCardContent>
                <div class="max-w-screen-lg mx-auto grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      
        <div
            v-for="(candidate, index) in candidates"
            :key="candidate.id"
            :class="{
                 'col-span-1':
                                selected?.id === candidate.id &&
                                selected?.first !== '-',
                'lg:col-start-2': index === candidates.length - 1 && candidates.length % 3 === 1,
                'md:col-start-2': index === candidates.length - 1 && candidates.length % 3 === 1,
            }"
        >
            <ElectionCandidateCard
                :candidate="candidate"
                :active="selected?.id === candidate.id"
                @click="selected = candidate"
            />
        </div>
    </div>
                
            </UiCardContent>
        </template>
    </UiCard>
</template>
