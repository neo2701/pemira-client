<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const user = useAuth().user();
const electionStore = useElectionStore();

const loading = ref(false);

const cancel = () => {
    useAuth().signOut();
    navigateTo('/login');
};

const start = () => {
    navigateTo('/election/1');
};

onMounted(async () => {
    loading.value = true;

    await electionStore.getEvent(1);
    const done = await electionStore.checkUserStatus();

    if (done) {
        navigateTo('/election/done');
        return;
    }

    loading.value = false;
});
</script>

<template>
    <NuxtLayout>
        <div v-if="user" class="grow flex items-center justify-center">
            <StartCard
                :user="user"
                :loading="loading"
                @start="start"
                @cancel="cancel"
            />
        </div>
    </NuxtLayout>
</template>
