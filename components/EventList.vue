<script lang="ts" setup>
defineProps<{
    events: Event[];
}>();
</script>

<template>
    <div class="grid grid-cols-4">
        <EventCard v-for="event in $props.events" :event="event" />
    </div>
</template>
