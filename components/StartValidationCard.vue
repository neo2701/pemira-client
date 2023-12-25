<script lang="ts" setup>
const eventStore = useEventStore();

const loading = ref(false);

const open = () =>
    navigateTo(`/admin/events/${eventStore.event?.id}/validation`);
</script>

<template>
    <UiCard class="max-w-xs mx-auto">
        <UiCardHeader>
            <UiCardTitle>Validasi Suara</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription>
                Mulai validasi semua surat suara yang telah masuk.
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Mulai Validasi"
                description="Apakah kamu yakin ingin mulai validasi surat suara?"
                @confirm="open"
            >
                <UiButton :loading="loading" color="primary" class="w-full">
                    Mulai Validasi
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
