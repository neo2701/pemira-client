<script lang="ts" setup>
const props = defineProps<{
    division: Division;
    candidates: Candidate[];
}>();

const sortedCandidates = computed(() =>
    [...props.candidates].sort((a, b) => a.order - b.order),
);

const percentage = (candidate: Candidate) => {
    if (!candidate.ballots_count || !candidate.votes_count) {
        return 0;
    }

    return Math.round((candidate.votes_count / candidate.ballots_count) * 100);
};
</script>

<template>
    <div
        class="max-w-screen-lg mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
    >
        <div v-for="candidate in sortedCandidates" class="flex flex-col gap-2">
            <ElectionCandidateCardValidation :candidate="candidate" display />
            <div class="grid grid-cols-3 gap-2 text-sm">
                <div class="col-span-2">Suara Sah:</div>
                <div>{{ candidate.votes_count }}</div>
                <div class="col-span-2">Persentase:</div>
                <div>{{ percentage(candidate) }}%</div>
            </div>
        </div>
    </div>
</template>
