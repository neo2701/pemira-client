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
        class="bg-[#8494B4] relative cursor-pointer transition select-none overflow-hidden group hover:ring-2 hover:ring-[#647CA0] active:scale-95"
        @click="$emit('click', $props.event)"
    >
        <UiCardHeader
            class="bg-[#2c323e] w-full h-full absolute flex items-center justify-center bg-opacity-0 transition group-hover:bg-opacity-50"
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
            <UiCardTitle class="text-white font-extrabold">{{
                $props.event.title
            }}</UiCardTitle>
            <UiCardDescription class="text-white">
                {{ $props.event.description }}
            </UiCardDescription>
        </UiCardHeader>
    </UiCard>
</template>
