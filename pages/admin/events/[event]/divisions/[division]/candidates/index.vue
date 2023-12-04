<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

const getDivision = async () => {
    if (!eventStore.event) return;

    const { data, error } = await useApiFetch(
        `/events/${eventStore.event?.id}/divisions/${route.params.division}`,
    );

    if (error.value) {
        navigateTo(`/admin/events/${eventStore.event?.id}/divisions`);
        return;
    }

    eventStore.division = data.value;
};

onMounted(getDivision);
</script>

<template>
    <div class="grid gap-4">
        <div>
            <UiButton
                variant="link"
                class="px-0"
                @click="
                    navigateTo(
                        `/admin/events/${eventStore.event?.id}/divisions`,
                    )
                "
            >
                <Icon name="fluent:arrow-left-16-regular" /> Kembali
            </UiButton>
        </div>
        <div>
            <h2 class="text-xl font-bold">
                Kandidat {{ eventStore.division?.name }}
            </h2>
            <div class="text-sm text-muted-foreground">
                Daftar kandidat yang mencalonkan diri sebagai
                {{ eventStore.division?.name }}.
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <UiCard class="overflow-hidden">
                <UiAspectRatio :ratio="3 / 4">
                    <img
                        src="/dummy_candidate1.jpg"
                        class="object-cover w-full h-full"
                    />
                </UiAspectRatio>
                <UiCardHeader>
                    <UiCardTitle>Prabowo</UiCardTitle>
                    <UiCardDescription>22081010158</UiCardDescription>
                </UiCardHeader>
                <UiCardFooter>
                    <UiButton class="w-full">Buka</UiButton>
                </UiCardFooter>
            </UiCard>
            <UiCard class="overflow-hidden">
                <UiAspectRatio :ratio="3 / 4">
                    <img
                        src="/dummy_candidate2.jpg"
                        class="object-cover w-full h-full"
                    />
                </UiAspectRatio>
                <UiCardHeader>
                    <UiCardTitle>Jokowi</UiCardTitle>
                    <UiCardDescription>22081010158</UiCardDescription>
                </UiCardHeader>
                <UiCardFooter>
                    <UiButton class="w-full">Buka</UiButton>
                </UiCardFooter>
            </UiCard>
            <UiCard class="overflow-hidden">
                <UiAspectRatio :ratio="3 / 4">
                    <img
                        src="/dummy_candidate3.jpg"
                        class="object-cover w-full h-full"
                    />
                </UiAspectRatio>
                <UiCardHeader>
                    <UiCardTitle>Gibran</UiCardTitle>
                    <UiCardDescription>22081010158</UiCardDescription>
                </UiCardHeader>
                <UiCardFooter>
                    <UiButton class="w-full">Buka</UiButton>
                </UiCardFooter>
            </UiCard>
            <div>
                <UiAspectRatio :ratio="1 / 1">
                    <UiCard
                        class="h-full flex items-center justify-center bg-muted border-dashed cursor-pointer transition hover:bg-white"
                        @click="
                            navigateTo(
                                `/admin/events/${eventStore.event?.id}/divisions/${eventStore.division?.id}/candidates/create`,
                            )
                        "
                    >
                        <UiCardDescription class="font-medium text-center">
                            <Icon name="fluent:add-24-regular" />
                        </UiCardDescription>
                    </UiCard>
                </UiAspectRatio>
            </div>
        </div>
    </div>
</template>
