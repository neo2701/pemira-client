<script lang="ts" setup>
const alertStore = useAlertStore();
</script>

<template>
    <UiAlert v-if="alertStore.active" :variant="'destructive'">
        <UiAlertDescription>
            {{ alertStore.data.text }}
        </UiAlertDescription>
    </UiAlert>
</template>
