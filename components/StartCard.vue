<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEventStore } from '@/stores/event';
import { useRouter } from 'vue-router';

const eventStore = useEventStore();
const router = useRouter();
const loading = ref(false);

const isOpen = computed(() => {
    return eventStore.status;
});

const start = async () => {
    if (loading.value) return;

    loading.value = true;

    console.log('Memeriksa status pemilihan...');
    console.log('Status pemilihan:', isOpen.value);

    if (isOpen.value) {
        console.log('Pemilihan terbuka, lanjutkan ke halaman pemilihan.');
        const eventId = eventStore.event?.id;
        if (eventId) {
            router.push(`/election/${eventId}`);
        } else {
            console.error('Event ID not found!');
            alert('Error: Event ID is missing.');
        }
    } else {
        console.log('Pemilihan belum dimulai.');
        alert('Pemilihan belum dimulai.');
    }

    loading.value = false;
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
