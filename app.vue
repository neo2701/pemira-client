<script lang="ts" setup>
const { year } = usePemiraConfig();
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
</script>

<template>
    <!-- <NuxtLoadingIndicator color="#000" /> -->
    <NuxtPage />
</template>
