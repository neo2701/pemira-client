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
                    <UiCardTitle class="flex justify-between">
                        Total Kandidat
                        <Icon
                            name="fluent:people-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl">
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
                    <UiCardDescription class="text-2xl">
                        {{ counts.whitelists }}
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
        </div>
        <template v-if="eventStore.status === 1">
            <hr class="border-dashed" />
            <ElectionStatus />
        </template>
        <hr class="border-dashed" />
        <OpenElectionCard v-if="eventStore.status === 0" />
        <CloseElectionCard v-else-if="eventStore.status === 1" />
    </div>
</template>
