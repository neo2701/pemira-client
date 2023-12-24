<script lang="ts" setup>
definePageMeta({
    layout: 'election',
});

const user = useAuth().user();
const electionStore = useElectionStore();

electionStore.setProgress(7);
</script>

<template>
    <NuxtLayout>
        <UiCard class="grow flex flex-col">
            <UiCardHeader class="grow flex items-center justify-center">
                <UiCardTitle class="text-2xl">
                    Selamat {{ user?.name }}!
                </UiCardTitle>
                <UiCardDescription class="text-center">
                    Terima kasih telah berpartisipasi dalam PEMIRA 2024
                </UiCardDescription>
            </UiCardHeader>
        </UiCard>
    </NuxtLayout>
</template>
