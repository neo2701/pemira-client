<script lang="ts" setup>
interface Result extends Division {
    candidates: Candidate[];
}

const route = useRoute();

const result = ref<Result[]>();
const loading = ref(false);

const getResult = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/result`,
    );

    loading.value = false;

    if (error.value) {
        return;
    }

    result.value = data.value;

    console.log(data.value, error.value);
};

onMounted(getResult);
</script>

<template>
    <UiCard
        class="relative grow flex flex-col justify-center border-0 text-center"
    >
        <UiCardHeader>
            <UiCardTitle class="text-2xl"> Hasil Pengesahan </UiCardTitle>
            <UiCardDescription>PEMIRA 2024</UiCardDescription>
        </UiCardHeader>
        <UiCardContent v-if="loading">
            <Icon name="svg-spinners:ring-resize" size="24" class="mx-auto" />
        </UiCardContent>
        <UiCardContent class="grid grid-flow-col auto-cols-fr gap-4">
            <UiCard v-for="division in result">
                <UiCardHeader>
                    <UiCardTitle>{{ division.name }} </UiCardTitle>
                </UiCardHeader>
                <hr class="border border-dashed" />
                <UiTable class="text-start">
                    <UiTableHeader>
                        <UiTableRow>
                            <UiTableHead>Nama</UiTableHead>
                            <UiTableHead class="text-center">Suara</UiTableHead>
                        </UiTableRow>
                    </UiTableHeader>
                    <UiTableBody>
                        <UiTableRow v-for="candidate in division.candidates">
                            <UiTableCell class="text-ellipsis overflow-hidden">
                                {{ candidate.first_name }}
                                <div v-if="candidate.second_name">
                                    & {{ candidate.second_name }}
                                </div>
                            </UiTableCell>
                            <UiTableCell class="text-center">
                                {{ candidate.votes_count }}
                            </UiTableCell>
                        </UiTableRow>
                    </UiTableBody>
                </UiTable>
            </UiCard>
        </UiCardContent>
        <UiCardFooter v-if="!loading">
            <NuxtLink
                :to="`/admin/events/${route.params.event}/dashboard`"
                class="mx-auto"
            >
                <UiButton>Selesai</UiButton>
            </NuxtLink>
        </UiCardFooter>
    </UiCard>
</template>
