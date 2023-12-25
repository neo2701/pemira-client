<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

useElectionStore().setProgress(4);

const divisionId = 2;
</script>

<template>
    <NuxtLayout>
        <ElectionDivisionCandidates
            :divisionId="divisionId"
            previous="3"
            next="5"
        />
    </NuxtLayout>
</template>
