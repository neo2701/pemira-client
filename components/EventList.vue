<script lang="ts" setup>
defineProps<{
    events: Event[];
}>();

defineEmits<{
    (e: 'click', event: Event): void;
}>();
</script>

<template>
    <div class="grid md:grid-cols-4 grid-cols-2 gap-4">
        <EventCard
            v-for="event in $props.events"
            :event="event"
            @click="(e) => $emit('click', e)"
        />
    </div>
</template>
