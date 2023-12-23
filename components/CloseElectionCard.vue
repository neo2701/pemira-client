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
                Website pemilihan tidak dapat diakses oleh pemilih setelah
                pemilihan ditutup.
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Tutup Pemilihan"
                description="Apakah anda yakin ingin menutup pemilihan?"
                @confirm="open"
            >
                <UiButton
                    :loading="loading"
                    variant="destructive"
                    class="w-full"
                    @click="open"
                >
                    Tutup Pemilihan
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
