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
    <UiCard class="grow flex flex-col">
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
                    variant="outline"
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
                    <UiButton>Selanjutnya</UiButton>
                </ConfirmationDialog>
                <UiButton
                    v-else
                    variant="secondary"
                    class="border cursor-not-allowed"
                >
                    Selanjutnya
                </UiButton>
            </UiCardFooter>
            <UiCardContent>
                <div class="max-w-screen-lg mx-auto grid grid-cols-4 gap-4">
                    <ElectionCandidateCard
                        v-for="candidate in candidates"
                        :candidate="candidate"
                        :active="selected?.id === candidate.id"
                        :class="{
                            'col-span-2': selected?.id === candidate.id,
                        }"
                        @click="selected = candidate"
                    />
                </div>
            </UiCardContent>
        </template>
    </UiCard>
</template>
