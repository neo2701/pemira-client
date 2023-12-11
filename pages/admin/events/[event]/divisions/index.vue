<script lang="ts" setup>
const eventStore = useEventStore();

const divisions = ref<Division[]>([]);

const getDivisions = async () => {
    if (!eventStore.event) return;

    const { data } = await useApiFetch(
        `/events/${eventStore.event?.id}/divisions`,
    );

    divisions.value = data.value;
};

onMounted(getDivisions);
</script>

<template>
    <div class="grid gap-4">
        <div>
            <h2 class="text-xl font-bold">Divisi Kandidat</h2>
            <div class="text-sm text-muted-foreground">
                Daftar divisi kandidat yang mencalonkan diri berdasarkan
                divisinya masing-masing.
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <UiCard
                v-for="division in divisions"
                class="h-[90px] transition cursor-pointer hover:bg-muted"
                @click="
                    navigateTo(
                        `/admin/events/${eventStore.event?.id}/divisions/${division.id}/candidates`,
                    )
                "
            >
                <UiCardHeader>
                    <UiCardTitle>{{ division.name }}</UiCardTitle>
                    <UiCardDescription>
                        {{ division.candidates_count }}
                        Kandidat
                    </UiCardDescription>
                </UiCardHeader>
            </UiCard>
            <DivisionFormDialog
                v-if="eventStore.event"
                :event="eventStore.event"
                @success="getDivisions"
            >
                <UiCard
                    class="h-[90px] flex items-center justify-center bg-muted border-dashed cursor-pointer transition hover:bg-white"
                >
                    <UiCardDescription class="font-medium text-center">
                        <Icon name="fluent:add-24-regular" />
                    </UiCardDescription>
                </UiCard>
            </DivisionFormDialog>
        </div>
    </div>
</template>
