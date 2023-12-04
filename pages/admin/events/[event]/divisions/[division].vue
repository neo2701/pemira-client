<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

if (!eventStore.division) {
    // await eventStore.getDivision();
}
</script>

<template>
    <NuxtPage />
</template>
