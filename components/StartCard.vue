<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'start'): void;
    (e: 'cancel'): void;
}>();

const props = defineProps<{
    user: User;
    loading?: boolean;
}>();

const electionStore = useElectionStore();
const disabled = computed(() => {
    if (!electionStore.event) {
        return true; // Tombol akan dinonaktifkan jika event tidak ada
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return true; // Jika pemilihan sudah ditutup
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return false; // Jika pemilihan sudah dibuka, tombol bisa ditekan
    } else {
        return true; // Jika event ada, tapi kondisi lainnya tidak terpenuhi, tombol dinonaktifkan
    }
});

const buttonText = computed(() => {
    if (!electionStore.event) {
        return 'Pemilihan belum dimulai'; // Tampilkan jika event belum ada
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return 'Pemilihan sudah ditutup'; // Tampilkan jika pemilihan sudah ditutup
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return 'Mulai Pemilihan'; // Tampilkan jika pemilihan sudah dibuka tapi belum ditutup
    } else {
        return 'Pemilihan belum dimulai'; // Tampilkan jika tidak ada kondisi lain
    }
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
                <UiAvatarImage :src="props.user.picture" />
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
                :loading="$props.loading"
                :disabled="disabled"
                size="lg"
                class="w-full"
                @click="emit('start')"
            >
                {{ buttonText }}
            </UiButton>
            <UiCardDescription>Atau</UiCardDescription>
            <UiButton
                :disabled="$props.loading"
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
