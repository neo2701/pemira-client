<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

useElectionStore().setProgress(3);

const divisionId = 1;
</script>

<template>
    <NuxtLayout>
        <ElectionDivisionCandidates
            :divisionId="divisionId"
            previous="2"
            next="4"
        />
    </NuxtLayout>
</template>
