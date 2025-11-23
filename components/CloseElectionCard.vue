<script lang="ts" setup>
import { ref } from 'vue';
import { useEventStore } from '@/stores/event';

const eventStore = useEventStore();

const loading = ref(false);
const errorMessage = ref('');

// Function to close the election
const close = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    try {
        await eventStore.closeElection();
    } catch (error) {
        // Handle the error if the API call fails
        errorMessage.value =
            'Failed to close the election. Please try again later.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto bg-secondary">
        <UiCardHeader>
            <UiCardTitle class="text-primary">Pemilihan</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription class="text-foreground">
                Website pemilihan tidak dapat diakses oleh pemilih setelah
                pemilihan ditutup.
            </UiCardDescription>

            <!-- Display error message if there's an issue -->
            <p v-if="errorMessage" class="text-red-500 mt-2">
                {{ errorMessage }}
            </p>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Tutup Pemilihan"
                description="Apakah kamu yakin ingin menutup pemilihan?"
                @confirm="close"
            >
                <UiButton
                    :loading="loading"
                    :disabled="loading"
                    variant="destructive"
                    class="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    Tutup Pemilihan
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
