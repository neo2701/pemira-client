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
</script>

<template>
    <h2 class="text-xl font-bold mb-4">Dashboard</h2>
    <div class="grid gap-6">
        <div class="grid grid-cols-2 gap-4">
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Kandidat
                        <Icon
                            name="fluent:people-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl text-foreground">
                        {{ counts.candidates }}
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Whitelist
                        <Icon
                            name="fluent:checkbox-person-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl text-foreground">
                        {{ counts.whitelists }}
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
        </div>
        <template v-if="[1, 2].includes(eventStore.status)">
            <hr class="border-dashed" />
            <ElectionStatus />
        </template>
        <hr class="border-dashed" />

        <OpenElectionCard v-if="eventStore.status === 0" />
        <CloseElectionCard v-else-if="eventStore.status === 1" />
        <template v-else-if="eventStore.status === 2">
            <div class="flex justify-center gap-4">
                <div>
                    <OpenElectionCard reopen />
                </div>
                <div>
                    <StartValidationCard />
                </div>
            </div>
        </template>
    </div>
</template>
