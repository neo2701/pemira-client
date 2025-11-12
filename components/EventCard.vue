<script lang="ts" setup>
defineProps<{
    event: Event;
}>();

defineEmits<{
    (e: 'click', event: Event): void;
}>();

const runtimeConfig = useRuntimeConfig();
const baseURL = runtimeConfig.public.apiBase + '/../storage/';
</script>

<template>
    <UiCard
        class="relative cursor-pointer transition select-none overflow-hidden group hover:ring-2 hover:ring-accent active:scale-95"
        @click="$emit('click', $props.event)"
    >
        <UiCardHeader class="flex items-center border-b">
            <img
                :src="baseURL + $props.event.logo"
                :alt="$props.event.title"
                class="w-1/2 rounded-lg"
            />
        </UiCardHeader>
        <UiCardHeader>
            <UiCardTitle class="text-foreground font-extrabold">{{
                $props.event.title
            }}</UiCardTitle>
            <UiCardDescription class="text-muted-foreground">
                {{ $props.event.description }}
            </UiCardDescription>
        </UiCardHeader>

        <!-- Hover Overlay - placed after content so it's on top -->
        <div
            class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-90 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10"
        >
            <UiButton
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
            >
                Buka
            </UiButton>
        </div>
    </UiCard>
</template>
