<script lang="ts" setup>
definePageMeta({
    layout: 'election',
    middleware: 'election',
});

const electionStore = useElectionStore();

electionStore.setProgress(2);

const handleCapture = (imageData: string) => {
    electionStore.setKtmPicture(imageData);
    navigateTo('/election/3');
};

const handleBack = () => {
    navigateTo('/election/1');
};
</script>

<template>
    <NuxtLayout>
        <CameraCapture
            title="Foto KTM"
            description="Pastikan foto KTM terlihat jelas dan tidak blur"
            :portrait="false"
            :show-guides="true"
            guide-type="ktm-only"
            :mirror-video="false"
            @capture="handleCapture"
            @back="handleBack"
        />
    </NuxtLayout>
</template>
