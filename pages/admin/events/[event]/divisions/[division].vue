<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

if (
    !eventStore.division ||
    eventStore.division.id.toString() !== route.params.division
) {
    eventStore.division = undefined;
    await eventStore.getDivision(route.params.division as string);
}
</script>

<template>
    <NuxtPage />
</template>
