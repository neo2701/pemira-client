<script lang="ts" setup>
definePageMeta({
    layout: 'admin',
});

const route = useRoute();
</script>

<template>
    <NuxtLayout v-if="route.path !== '/admin/login'">
        <NuxtPage />
    </NuxtLayout>
    <NuxtPage v-else />
</template>
