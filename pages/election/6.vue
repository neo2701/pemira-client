<script lang="ts" setup>
definePageMeta({
    layout: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(6);

const divisionId = 4;
const candidates = ref<Candidate[]>([]);
const loading = ref(false);
const selected = ref<Candidate>();

const getCandidates = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${electionStore.event?.id}/candidates?division_id=${divisionId}`,
    );

    if (error.value) {
        return;
    }

    candidates.value = data.value;
    loading.value = false;
};

const confirm = () => {
    if (!selected.value) {
        return;
    }

    electionStore.ballots[divisionId] = {
        division_id: divisionId,
        candidate_id: selected.value.id,
    };

    navigateTo('/election/7');
};

onMounted(() => {
    if (
        electionStore.ktmPicture === undefined ||
        electionStore.ballots[1] == undefined ||
        electionStore.ballots[2] === undefined ||
        electionStore.ballots[3] === undefined
    ) {
        navigateTo('/election/5');
    }

    getCandidates();
});
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="flex items-center">
                <UiCardTitle>KAHIMA dan WAKAHIMA</UiCardTitle>
                <UiCardDescription>
                    Pilih salah satu untuk melihat visi & misi
                </UiCardDescription>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <UiButton variant="outline" @click="navigateTo('/election/5')">
                    Kembali
                </UiButton>
                <ConfirmationDialog
                    v-if="selected"
                    title="Apakah kamu yakin?"
                    :description="`Pilih ${selected?.first_name} dan ${selected?.second_name} sebagai KAHIMA dan WAKAHIMA`"
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
                        :active="selected === candidate"
                        :class="{
                            'col-span-2': selected === candidate,
                        }"
                        @click="selected = candidate"
                    />
                </div>
            </UiCardContent>
        </UiCard>
    </NuxtLayout>
</template>
