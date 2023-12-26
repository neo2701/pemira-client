<script lang="ts" setup>
const route = useRoute();
const validationStore = useValidationStore();

const currentDivision = ref<number>();
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

    validationStore.result = data.value;

    if (validationStore.result) {
        currentDivision.value = 0;
    }
};

const next = () => {
    if (
        currentDivision.value === undefined ||
        validationStore.result === undefined
    ) {
        return;
    }

    if (currentDivision.value + 1 < validationStore.result.length) {
        currentDivision.value++;
    } else {
        navigateTo(`/admin/events/${route.params.event}/result/overall`);
    }
};

const previous = () => {
    if (currentDivision.value === undefined || currentDivision.value === 0) {
        navigateTo(`/admin/events/${route.params.event}/dashboard`);
        return;
    }

    if (currentDivision.value - 1 >= 0) {
        currentDivision.value--;
    }
};

onMounted(getResult);
</script>

<template>
    <UiCard class="relative grow flex flex-col border-0 text-center">
        <UiCardHeader>
            <UiCardTitle class="text-2xl">Hasil Validasi</UiCardTitle>
            <UiCardDescription>
                {{
                    validationStore.result && currentDivision !== undefined
                        ? validationStore.result[currentDivision].name
                        : ''
                }}
            </UiCardDescription>
        </UiCardHeader>
        <UiCardContent v-if="loading">
            <Icon name="svg-spinners:ring-resize" size="24" class="mx-auto" />
        </UiCardContent>
        <UiCardFooter v-else class="justify-center gap-2">
            <UiButton variant="outline" @click="previous">Kembali</UiButton>
            <UiButton @click="next">Selanjutnya</UiButton>
        </UiCardFooter>
        <UiCardContent
            v-if="validationStore.result && currentDivision !== undefined"
        >
            <ValidationResults
                :division="validationStore.result[currentDivision]"
                :candidates="validationStore.result[currentDivision].candidates"
            />
        </UiCardContent>
    </UiCard>
</template>
