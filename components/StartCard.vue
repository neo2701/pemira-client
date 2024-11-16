<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue';
import { useElectionStore } from '@/stores/election';
import { useRouter } from 'vue-router';

const electionStore = useElectionStore();
const router = useRouter();
const loading = ref(false);
const auth = useAuth();

// Make user reactive
const user = ref(auth.user());
watch(
    () => auth.user(),
    (newUser) => {
        user.value = newUser;
    },
);

const isOpen = ref(false);

watchEffect(async () => {
    try {
        await electionStore.getEvent(1);
        isOpen.value = electionStore.event?.is_open ?? false;
    } catch (error) {
        console.error('Failed to get event:', error);
        isOpen.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
});

const start = async () => {
    if (!user.value) {
        router.push('/login');
        return;
    }

    loading.value = true;

    try {
        const done = await electionStore.checkUserStatus();
        loading.value = false;

        if (done) {
            router.push('/election/done');
        } else {
            router.push('/election/1');
        }
    } catch (error) {
        console.error('Error during election process:', error);
        loading.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto text-white">
        <UiCardHeader>
            <UiCardTitle>Pemilihan</UiCardTitle>
        </UiCardHeader>

        <UiCardFooter>
            <ConfirmationDialog
                :title="isOpen ? 'Mulai Pemilihan' : 'Pemilihan Belum Dimulai'"
                :description="
                    isOpen
                        ? 'Apakah kamu yakin ingin memulai pemilihan?'
                        : 'Pemilihan belum dimulai, Anda tidak bisa melanjutkan pemilihan.'
                "
                @confirm="start"
            >
                <UiButton
                    :loading="loading"
                    :disabled="loading || !isOpen"
                    class="w-full"
                >
                    {{ isOpen ? 'Mulai Pemilihan' : 'Pemilihan Belum Dimulai' }}
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
