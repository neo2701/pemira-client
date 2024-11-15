<script lang="ts" setup>
defineProps<{
    reopen?: boolean;
}>();

const eventStore = useEventStore();

const loading = ref(false);

const open = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    await eventStore.openElection();

    loading.value = false;
};
</script>

<template>
    <UiCard class="max-w-xs mx-auto text-white">
        <UiCardHeader>
            <UiCardTitle>Pemilihan</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiCardDescription>
                <template v-if="reopen">
                    Pemilihan akan dibuka kembali dan website pemilihan dapat
                    diakses oleh mahasiswa.
                </template>
                <template v-else>
                    Pastikan kandidat dan whitelist sudah terisi sebelum memulai
                    pemilihan.
                </template>
            </UiCardDescription>
        </UiCardContent>
        <UiCardFooter>
            <ConfirmationDialog
                :title="
                    $props.reopen ? 'Buka Kembali Pemilihan' : 'Mulai Pemilihan'
                "
                :description="
                    $props.reopen
                        ? 'Apakah kamu yakin ingin membuka kembali pemilihan?'
                        : 'Apakah kamu yakin ingin memulai pemilihan?'
                "
                @confirm="open"
            >
                <UiButton
                    :loading="loading"
                    :variant="$props.reopen ? 'outline' : undefined"
                    class="w-full"
                >
                    {{
                        $props.reopen
                            ? 'Buka Kembali Pemilihan'
                            : 'Mulai Pemilihan'
                    }}
                </UiButton>
            </ConfirmationDialog>
        </UiCardFooter>
    </UiCard>
</template>
