<script lang="ts" setup>
const eventStore = useEventStore();
const isLoading = ref(false);
const whitelists = ref('');

const get = async () => {
    if (!eventStore.event) return;

    isLoading.value = true;

    const { data } = await useApiFetch(
        `/events/${eventStore.event.id}/whitelists`,
    );

    whitelists.value = (data.value as Whitelist[])
        .map((whitelist: Whitelist) => whitelist.npm)
        .join('\n');

    isLoading.value = false;
};

const save = async () => {
    if (!eventStore.event) return;

    isLoading.value = true;

    await useApiFetch(`/events/${eventStore.event.id}/whitelists`, {
        method: 'POST',
        body: JSON.stringify({
            whitelists: whitelists.value.split('\n'),
        }),
    });

    isLoading.value = false;
};

onMounted(get);
</script>

<template>
    <div class="grid gap-4">
        <div>
            <h2 class="text-xl font-bold">Whitelist</h2>
            <div class="text-sm text-muted-foreground">
                List NPM yang diizinikan untuk memilih. (Pisah dengan spasi)
            </div>
        </div>
        <UiTextarea v-model="whitelists" :disabled="isLoading" />
        <div>
            <UiButton :loading="isLoading" @click="save">Simpan</UiButton>
        </div>
    </div>
</template>
