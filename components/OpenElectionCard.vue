<script lang="ts" setup>
import { ref } from 'vue';
import { useEventStore } from '@/stores/event';

const eventStore = useEventStore();

const loading = ref(false);
const errorMessage = ref('');

// Function to open the election
const open = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    try {
        await eventStore.openElection();
    } catch (error) {
        // Handle the error if the API call fails
        errorMessage.value =
            'Failed to open the election. Please try again later.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto bg-[#405980]">
        <UiCardHeader>
            <UiCardTitle class="text-white">Pemilihan</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription class="text-white">
                Website pemilihan dapat diakses oleh pemilih setelah pemilihan
                dibuka.
            </UiCardDescription>

            <!-- Display error message if there's an issue -->
            <p v-if="errorMessage" class="text-red-500 mt-2">
                {{ errorMessage }}
            </p>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                title="Buka Pemilihan"
                description="Apakah kamu yakin ingin membuka pemilihan?"
                @confirm="open"
            >
                <UiButton
                    :loading="loading"
                    :disabled="loading"
                    variant="outline"
                    class="w-full text-white bg-[#60799f] hover:bg-[#7e9fcf]"
                >
                    Buka Pemilihan
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
