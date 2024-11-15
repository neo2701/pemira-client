<script lang="ts" setup>
const eventStore = useEventStore();

const loading = ref(false);

const close = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    await eventStore.closeElection();

    loading.value = false;
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto bg-[#405980]">
        <UiCardHeader>
            <UiCardTitle class="text-white">Pemilihan</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription class="text-white">
                Website pemilihan tidak dapat diakses oleh pemilih setelah
                pemilihan ditutup.
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Tutup Pemilihan"
                description="Apakah kamu yakin ingin menutup pemilihan?"
                @confirm="close"
            >
                <UiButton
                    :loading="loading"
                    variant="destructive"
                    class="w-full text-white bg-[#60799f] hover:bg-[#7e9fcf]"
                >
                    Tutup Pemilihan
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
