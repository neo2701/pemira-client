<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

const counts = reactive({
    candidates: 0,
    whitelists: 0,
});

const getSummary = async () => {
    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/summary`,
    );

    if (error.value) {
        return;
    }

    counts.candidates = data.value?.candidates_count ?? 0;
    counts.whitelists = data.value?.whitelists_count ?? 0;
};

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
        <template v-if="[1, 2].includes(eventStore.status)">
            <hr class="border-dashed border-[#4a5e87]" />
            <ElectionStatus />
        </template>
        <hr class="border-dashed border-[#4a5e87]" />
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
