<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

useElectionStore().setProgress(5);

const divisionId = 3;
</script>

<template>
    <NuxtLayout>
        <ElectionDivisionCandidates
            :divisionId="divisionId"
            previous="4"
            next="6"
        />
    </NuxtLayout>
</template>
