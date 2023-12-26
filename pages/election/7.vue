<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

const electionStore = useElectionStore();

const loading = ref(false);

electionStore.setProgress(7);

const submitBallot = async () => {
    loading.value = true;

    const formData = new FormData();

    formData.append('ktm_picture', electionStore.ktmPicture);
    formData.append('verification_picture', electionStore.verificationPicture);

    for (const key in electionStore.ballots) {
        formData.append(
            `details[${key}][division_id]`,
            electionStore.ballots[key].division.id.toString(),
        );
        formData.append(
            `details[${key}][candidate_id]`,
            electionStore.ballots[key].candidate.id.toString(),
        );
    }

    const { error } = await useApiFetch(
        `/events/${electionStore.event?.id}/ballots`,
        {
            method: 'POST',
            body: formData,
        },
    );

    if (error.value) {
        navigateTo('/');
        return;
    }
};

const confirm = async () => {
    await submitBallot();
    electionStore.event = undefined;
    navigateTo('/election/done');
};
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="text-center">
                <UiCardTitle>Ringkasan Pemilihan</UiCardTitle>
                <UiCardDescription>
                    Apakah kamu yakin dengan hasil pemilihan ini?
                </UiCardDescription>
            </UiCardHeader>
            <UiCardFooter class="flex justify-center gap-4">
                <UiButton
                    :disabled="loading"
                    size="lg"
                    variant="outline"
                    @click="navigateTo('/election/6')"
                >
                    Kembali
                </UiButton>
                <ConfirmationDialog
                    v-if="!loading"
                    title="Proses Pemilihan"
                    description="Apakah kamu yakin dengan hasil pemilihan ini? Kamu tidak dapat mengubah hasil pemilihan setelah diproses."
                    @confirm="confirm"
                >
                    <UiButton size="lg">Selanjutnya</UiButton>
                </ConfirmationDialog>
                <UiButton v-else :loading="loading" size="lg">
                    Selanjutnya
                </UiButton>
            </UiCardFooter>
            <UiCardContent>
                <div
                    class="max-w-screen-lg mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
                >
                    <div
                        v-for="ballot in electionStore.ballots"
                        class="flex flex-col gap-2"
                    >
                        <div class="text-center text-sm font-semibold">
                            {{ ballot.division.name }}
                        </div>
                        <ElectionCandidateCard
                            :candidate="ballot.candidate"
                            display
                        />
                    </div>
                </div>
            </UiCardContent>
        </UiCard>
    </NuxtLayout>
</template>
