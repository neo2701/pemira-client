<script lang="ts" setup>
defineProps<{
    event: Event;
}>();

const runtimeConfig = useRuntimeConfig();
const baseURL = runtimeConfig.public.apiBase + '/../storage/';
</script>

<template>
    <UiCard
        class="relative cursor-pointer transition select-none overflow-hidden group hover:ring-2 hover:ring-black active:scale-95"
    >
        <UiCardHeader
            class="w-full h-full absolute flex items-center justify-center bg-black bg-opacity-0 transition group-hover:bg-opacity-50"
        >
            <UiButton class="opacity-0 transition group-hover:opacity-100">
                Buka
            </UiButton>
        </UiCardHeader>
        <UiCardHeader class="flex items-center border-b">
            <img
                :src="baseURL + $props.event.logo"
                :alt="$props.event.title"
                class="w-1/2 rounded-lg"
            />
        </UiCardHeader>
        <UiCardHeader>
            <UiCardTitle>{{ $props.event.title }}</UiCardTitle>
            <UiCardDescription>
                {{ $props.event.description }}
            </UiCardDescription>
        </UiCardHeader>
    </UiCard>
</template>
