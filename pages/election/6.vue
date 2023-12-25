<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

useElectionStore().setProgress(6);

const divisionId = 4;
</script>

<template>
    <NuxtLayout>
        <ElectionDivisionCandidates
            :divisionId="divisionId"
            previous="5"
            next="7"
        />
    </NuxtLayout>
</template>
