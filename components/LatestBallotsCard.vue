<script lang="ts" setup>
import dayjs from 'dayjs';

const route = useRoute();

const ballots = ref<Ballot[]>([]);
const loading = ref(false);

const getBallots = async () => {
    loading.value = true;

    const { data, error } = await useApiFetch(
        `/events/${route.params.event}/ballots/latest`,
    );

    loading.value = false;

    if (error.value) {
        return;
    }

    ballots.value = data.value ?? [];
};

const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
};

onMounted(() => {
    getBallots();
});
</script>

<template>
    <UiCard>
        <UiCardHeader>
            <UiCardTitle class="flex justify-between">
                10 Surat Suara Terakhir
                <Icon
                    name="fluent:people-16-regular"
                    class="text-muted-foreground"
                />
            </UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
            <UiTable>
                <UiTableHeader>
                    <UiTableRow>
                        <UiTableHead>NPM</UiTableHead>
                        <UiTableHead>Nama</UiTableHead>
                        <UiTableHead>Waktu</UiTableHead>
                    </UiTableRow>
                </UiTableHeader>
                <UiTableBody>
                    <UiTableRow v-for="ballot in ballots">
                        <UiTableCell>
                            {{ ballot.user?.npm }}
                        </UiTableCell>
                        <UiTableCell>{{ ballot.user?.name }}</UiTableCell>
                        <UiTableCell>
                            {{ formatDate(ballot.created_at) }}
                        </UiTableCell>
                    </UiTableRow>
                </UiTableBody>
            </UiTable>
        </UiCardContent>
    </UiCard>
</template>
