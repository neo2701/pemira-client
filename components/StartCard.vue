<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue';
import { useElectionStore } from '@/stores/election';
import { useRouter } from 'vue-router';

const electionStore = useElectionStore();
const router = useRouter();
const loading = ref(false);
const auth = useAuth();

const user = ref(auth.user());
watch(
    () => auth.user(),
    (newUser) => {
        user.value = newUser;
    },
);

const avatarSrc = computed(() => {
    return user.value?.picture || '/default-avatar.png'; // Ganti dengan path default avatar Anda
});

const isOpen = ref(false);

watchEffect(async () => {
    try {
        await electionStore.getEvent(1);
        isOpen.value = Boolean(electionStore.event?.is_open ?? false);
    } catch (error) {
        console.error('Failed to get event:', error);
        isOpen.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
});

const disabled = computed(() => {
    if (!electionStore.event) {
        return true;
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return true;
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return false;
    } else {
        return true;
    }
});

const buttonText = computed(() => {
    if (!electionStore.event) {
        return 'Pemilihan belum dimulai';
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return 'Pemilihan sudah ditutup';
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return 'Mulai Pemilihan';
    } else {
        return 'Pemilihan belum dimulai';
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

const cancel = async () => {
    try {
        await auth.signOut();
        router.push('/login');
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Terjadi kesalahan saat logout, silakan coba lagi.');
    }
};
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
                <UiAvatarImage :src="avatarSrc" />
            </UiAvatar>
            <UiCardDescription class="text-center">
                Sebagai:
                <div class="text-slate-100 font-bold mt-1">
                    {{ user?.name || 'Pengguna' }}
                </div>
            </UiCardDescription>
        </UiCardContent>

        <UiCardFooter class="w-full grid gap-2 text-center text-black">
            <ConfirmationDialog
                :title="buttonText"
                :description="
                    !disabled
                        ? 'Apakah kamu yakin ingin memulai pemilihan?'
                        : 'Pemilihan belum dimulai, Anda tidak bisa melanjutkan pemilihan.'
                "
                @confirm="start"
            >
                <UiButton
                    :loading="loading"
                    :disabled="disabled"
                    size="lg"
                    class="w-full bg-[#d3d7de] hover:text-white transition-all disabled:bg-[#d3d7de] disabled:text-gray-500 disabled:cursor-not-allowed not-disabled:hover:bg-[#8e94a0] not-disabled:hover:text-white"
                >
                    {{ buttonText }}
                </UiButton>
            </ConfirmationDialog>

            <UiCardDescription>Atau</UiCardDescription>

            <UiButton
                :disabled="loading"
                size="lg"
                variant="outline"
                class="w-full hover:bg-[#8e94a0] bg-[#d3d7de]"
                @click="cancel"
            >
                <Icon name="material-symbols:logout" size="16"></Icon>
                Keluar
            </UiButton>
        </UiCardFooter>
    </UiCard>
</template>
