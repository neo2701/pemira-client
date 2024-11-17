<script lang="ts" setup>
const eventStore = useEventStore();

const loading = ref(false);

const open = () =>
    navigateTo(`/admin/events/${eventStore.event?.id}/validation`);
</script>

<template>
    <UiCard class="max-w-xs mx-auto text-white">
        <UiCardHeader>
            <UiCardTitle>Validasi Suara</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription class="text-white">
                Mulai validasi semua surat suara yang telah masuk.
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Mulai Validasi"
                description="Apakah kamu yakin ingin mulai validasi surat suara?"
                @confirm="open"
            >
                <UiButton
                    :loading="loading"
                    class="w-full bg-green-500 hover:bg-green-600 hover:text-white"
                >
                    Mulai Validasi
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
