<script lang="ts" setup>
const electionStore = useElectionStore();
</script>

<template>
    <div class="h-[calc(100dvh)] flex flex-col">
        <div class="p-4">
            <UiProgress v-model="electionStore.progress" />
        </div>
        <slot></slot>
    </div>
</template>
