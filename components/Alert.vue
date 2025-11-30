<script lang="ts" setup>
const alertStore = useAlertStore();
</script>

<template>
    <UiAlert
        v-if="alertStore.active"
        :variant="'destructive'"
        class="overflow-hidden"
    >
        <UiAlertDescription>
            {{ alertStore.data.text }}
        </UiAlertDescription>
    </UiAlert>
</template>
z