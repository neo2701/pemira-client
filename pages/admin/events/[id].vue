<script lang="ts" setup>
definePageMeta({
    layout: 'events',
});

const route = useRoute();
const eventStore = useEventStore();

if (!eventStore.event) {
    await eventStore.get(route.params.id);
}
</script>

<template>
    <NuxtPage></NuxtPage>
</template>
