<script lang="ts" setup>
import { computed } from 'vue';
import { useElectionStore } from '@/stores/election';

const emit = defineEmits<{
    (e: 'start'): void;
    (e: 'cancel'): void;
}>();

const props = defineProps<{
    user: User;
    loading?: boolean;
}>();

const electionStore = useElectionStore();

// Computed properties
const disabled = computed(() => {
    if (!electionStore.event) return true;
    if (electionStore.event.open_election_at && electionStore.event.close_election_at) return true;
    if (electionStore.event.open_election_at && !electionStore.event.close_election_at) return false;
    return true;
});

const buttonText = computed(() => {
    if (!electionStore.event) return 'Pemilihan belum dimulai';
    if (electionStore.event.open_election_at && electionStore.event.close_election_at) return 'Pemilihan sudah ditutup';
    if (electionStore.event.open_election_at) return 'Mulai Pemilihan';
    return 'Pemilihan belum dimulai';
});
</script>

<template>
    <UiCard class="max-w-sm w-full bg-transparent border-none">
        <UiCardHeader class="text-center">
            <h2 class="text-3xl">PEMIRA 2025</h2>
            <UiCardDescription class="text-sm mt-0">
                Selamat datang!
            </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="flex flex-col gap-6 items-center">
            <UiAvatar size="lg">
                <UiAvatarImage :src="props.user.picture || '/default-avatar.png'" />
            </UiAvatar>
            <UiCardDescription class="text-center">
                Sebagai:
                <div class="text-slate-100 font-bold mt-1">
                    {{ props.user.name }}
                </div>
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter class="w-full grid gap-2 text-center text-black">
            <UiButton
                :loading="props.loading"
                :disabled="disabled"
                size="lg"
                class="w-full"
                @click="emit('start')"
            >
                {{ buttonText }}
            </UiButton>
            <UiCardDescription>Atau</UiCardDescription>
            <UiButton
                :disabled="props.loading"
                size="lg"
                variant="outline"
                class="w-full hover:bg-[#8e94a0] bg-[#d3d7de]"
                @click="emit('cancel')"
            >
                Kembali
            </UiButton>
        </UiCardFooter>
    </UiCard>
</template>

<style scoped>
.text-slate-100 {
    color: #e5e7eb;
}
</style>
