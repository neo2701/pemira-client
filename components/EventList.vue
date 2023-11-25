<script lang="ts" setup>
defineProps<{
    events: Event[];
}>();

defineEmits<{
    (e: 'click', event: Event): void;
}>();
</script>

<template>
    <div class="grid grid-cols-4">
        <EventCard
            v-for="event in $props.events"
            :event="event"
            @click="(e) => $emit('click', e)"
        />
    </div>
</template>
