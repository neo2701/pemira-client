<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/event';

const route = useRoute();
const eventStore = useEventStore();

const counts = reactive({
    candidates: 0,
    whitelists: 0,
});

const loading = ref(false);
const errorMessage = ref('');

// Fetch summary data for candidates and whitelists
const getSummary = async () => {
    loading.value = true;
    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/summary`,
    );

    if (error.value) {
        errorMessage.value = 'Failed to fetch data';
        loading.value = false;
        return;
    }

    counts.candidates = data.value?.candidates_count ?? 0;
    counts.whitelists = data.value?.whitelists_count ?? 0;
    loading.value = false;
};

const isOpen = computed(() => {
    return eventStore.status;
});

// Fetch summary data on mount
onMounted(() => {
    getSummary();
});

// Log and display the current election status
console.log('Current election status:', isOpen.value);
</script>

<template>
    <h2 class="text-xl font-bold mb-4">Dashboard</h2>
    <div class="grid gap-6">
        <!-- Candidate and Whitelist Cards -->
        <div class="grid grid-cols-2 gap-4">
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between text-white">
                        Total Kandidat
                        <Icon
                            name="fluent:people-16-regular"
                            class="text-white"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl text-white">
                        {{ counts.candidates }}
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between text-white">
                        Total Whitelist
                        <Icon
                            name="fluent:checkbox-person-16-regular"
                            class="text-white"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl text-white">
                        {{ counts.whitelists }}
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
        </div>

        <!-- Conditional Rendering Based on Status -->
        <template v-if="eventStore.status">
            <!-- Status is true, meaning election is open -->
            <CloseElectionCard />
        </template>

        <template v-else>
            <OpenElectionCard />
            <!-- Status is false, meaning election is closed -->
        </template>

        <!-- Additional Condition for Error and Loading -->
        <template v-if="loading">
            <p>Loading...</p>
        </template>

        <template v-if="errorMessage">
            <p class="text-red-500">{{ errorMessage }}</p>
        </template>
    </div>
</template>
