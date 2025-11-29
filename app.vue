<script lang="ts" setup>
import { ref } from 'vue';
import { usePemiraConfig } from '@/composables/usePemiraConfig';

const { year } = usePemiraConfig();
const showPage = ref(false);

useSeoMeta({
    title: 'PEMIRA INFORMATIKA ' + year.value,
    ogType: 'website',
    ogTitle: 'PEMIRA INFORMATIKA ' + year.value,
    ogUrl: 'https://pemiraif.com',
    ogImage: 'https://pemiraif.com/logo.png',
    description: 'Pemilihan Raya Hima KM Informatika',
    ogDescription: 'Pemilihan Raya Hima KM Informatika',
    twitterTitle: 'PEMIRA INFORMATIKA ' + year.value,
    twitterDescription: 'Pemilihan Raya Hima KM Informatika',
    twitterCard: 'summary_large_image',
    twitterImage: 'https://pemiraif.com/logo.png',
});

const handleSplashComplete = () => {
    showPage.value = true;
};
</script>

<template>
    <!-- <NuxtLoadingIndicator color="#000" /> -->
    <SplashScreen @splash-complete="handleSplashComplete" />
    <Transition name="page-fade" appear>
        <NuxtPage v-if="showPage" />
    </Transition>
</template>

<style scoped>
.page-fade-enter-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
    opacity: 0;
}
</style>
