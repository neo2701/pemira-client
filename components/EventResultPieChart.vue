<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

const props = defineProps<{
    accepted: number;
    declined: number;
}>();

ChartJS.register(ArcElement, Tooltip, Legend);

const options = ref({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            labels: {
                font: {
                    family: 'Inter',
                },

                color: '#ffffff',
            },
        },
    },
});

const data = computed(() => ({
    labels: ['Suara Sah', 'Suara Tidak Sah'],
    datasets: [
        {
            label: 'Suara Sah',
            data: [props.accepted, props.declined],
            backgroundColor: ['#16a34a', '#dc2626'],
            hoverOffset: 4,
        },
    ],
}));
</script>

<template>
    <Pie :data="data" :options="options" />
</template>
