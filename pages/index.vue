<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const user = useAuth().user();

const cancel = () => {
    useAuth().signOut();
    navigateTo('/login');
};

const start = () => {
    navigateTo('/election/1');
};

onMounted(async () => {
    await useApiFetch('/auth/user');
});
</script>

<template>
    <NuxtLayout>
        <div v-if="user" class="grow flex items-center justify-center">
            <StartCard :user="user" @start="start" @cancel="cancel" />
        </div>
    </NuxtLayout>
</template>
