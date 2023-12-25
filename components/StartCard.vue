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
        return false;
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
        return 'Mulai Pemilihan';
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
</script>

<template>
    <UiCard class="w-96">
        <UiCardHeader class="text-center">
            <h2 class="text-3xl">PEMIRA</h2>
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
                <div class="text-black font-bold">{{ props.user.name }}</div>
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter class="w-full grid gap-2 text-center">
            <UiButton
                :loading="$props.loading"
                :disabled="disabled"
                class="w-full"
                @click="emit('start')"
            >
                {{ buttonText }}
            </UiButton>
            <UiCardDescription>Atau</UiCardDescription>
            <UiButton
                :disabled="$props.loading"
                variant="outline"
                class="w-full"
                @click="emit('cancel')"
            >
                Kembali
            </UiButton>
        </UiCardFooter>
    </UiCard>
</template>
