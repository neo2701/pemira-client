<script lang="ts" setup>
definePageMeta({
    layout: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(4);

const divisionId = 2;
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

    navigateTo('/election/5');
};

onMounted(() => {
    if (
        electionStore.ktmPicture === undefined ||
        electionStore.ballots[1] == undefined
    ) {
        navigateTo('/election/3');
    }

    getCandidates();
});
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="flex items-center">
                <UiCardTitle>BLJ Angkatan 2022</UiCardTitle>
                <UiCardDescription>
                    Pilih salah satu untuk melihat visi & misi
                </UiCardDescription>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <UiButton variant="outline" @click="navigateTo('/election/3')">
                    Kembali
                </UiButton>
                <ConfirmationDialog
                    v-if="selected"
                    title="Apakah kamu yakin?"
                    :description="`Pilih ${selected?.first_name} sebagai BLJ Angkatan 2022`"
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
