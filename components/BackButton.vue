<script lang="ts" setup>
defineProps<{
    to: string;
}>();
</script>

<template>
    <UiButton variant="link" class="px-0" @click="navigateTo($props.to)">
        <Icon name="fluent:arrow-left-16-regular" /> Kembali
    </UiButton>
</template>
