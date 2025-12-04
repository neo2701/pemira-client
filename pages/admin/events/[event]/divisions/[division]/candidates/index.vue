<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const eventStore = useEventStore();

const baseURL = runtimeConfig.public.apiBase + '/../storage/';

const candidates = ref<Candidate[]>([]);

const { data } = await useApiFetch(
    `/events/${route.params.event}/candidates?division_id=${route.params.division}`,
);

candidates.value = data.value ?? [];

const editCandidate = (candidate: Candidate) => {
    navigateTo(
        `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates/${candidate.id}/edit`,
    );
};
</script>

<template>
    <div class="grid gap-4">
        <div>
            <BackButton :to="`/admin/events/${route.params.event}/divisions`" />
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
            <UiCard v-for="candidate in candidates" class="overflow-hidden">
                <UiAspectRatio :ratio="1" class="relative">
                    <img
                        :src="baseURL + candidate.picture"
                        class="object-cover w-full h-full"
                    />
                    <div class="absolute bottom-0 right-0 p-4">
                        <div
                            class="w-10 h-10 bg-white flex items-center justify-center rounded-full text-black border-2 border-gray-300 shadow-lg"
                        >
                            {{ candidate.order }}
                        </div>
                    </div>
                </UiAspectRatio>
                <UiCardHeader>
                    <UiCardTitle>
                        <ul
                            v-if="candidate.second"
                            class="grid gap-2 list-disc list-inside"
                        >
                            <li>{{ candidate.first_name }}</li>
                            <li>{{ candidate.second_name }}</li>
                        </ul>
                        <template v-else>{{ candidate.first_name }}</template>
                    </UiCardTitle>
                </UiCardHeader>
                <UiCardFooter>
                    <UiButton
                        variant="outline"
                        @click="editCandidate(candidate)"
                    >
                        Manage
                    </UiButton>
                </UiCardFooter>
            </UiCard>
            <div>
                <UiAspectRatio :ratio="1 / 1">
                    <UiCard
                        class="h-full flex items-center justify-center bg-muted border-dashed cursor-pointer transition hover:bg-white"
                        @click="
                            navigateTo(
                                `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates/create`,
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
