<script lang="ts" setup>
const eventStore = useEventStore();

const loading = ref(false);

const open = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    await eventStore.openElection();

    loading.value = false;
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto">
        <UiCardHeader>
            <UiCardTitle>Pemilihan</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription>
                Pastikan kandidat dan whitelist sudah terisi sebelum memulai
                pemilihan.
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Mulai Pemilihan"
                description="Apakah anda yakin ingin memulai pemilihan?"
                @confirm="open"
            >
                <UiButton :loading="loading" color="primary" class="w-full">
                    Mulai Pemilihan
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
