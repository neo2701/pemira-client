<script lang="ts" setup>
definePageMeta({
    middleware: 'result',
});

const route = useRoute();
const validationStore = useValidationStore();

const previous = () => {
    navigateTo(`/admin/events/${route.params.event}/result/overall`);
};

const next = () => {
    navigateTo(`/admin/events/${route.params.event}/dashboard`);
};
</script>

<template>
    <UiCard
        class="relative grow flex flex-col border-0 text-center bg-transparent"
    >
        <UiCardHeader>
            <UiCardTitle class="text-2xl">Hasil Validasi</UiCardTitle>
            <UiCardDescription>PEMIRA 2025</UiCardDescription>
        </UiCardHeader>
        <UiCardFooter class="justify-center gap-2">
            <UiButton variant="secondary" @click="previous">Kembali</UiButton>
            <UiButton @click="next">Selesai</UiButton>
        </UiCardFooter>
        <UiCardContent class="grid grid-flow-col auto-cols-fr gap-4">
            <UiCard v-for="division in validationStore.result">
                <UiCardHeader class="text-white">
                    <UiCardTitle>{{ division.name }} </UiCardTitle>
                </UiCardHeader>
                <hr class="border border-white" />
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
    </UiCard>
</template>
