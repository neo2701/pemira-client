<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        candidate: Candidate;
        active?: boolean;
        display?: boolean;
    }>(),
    {
        active: false,
    },
);

const emit = defineEmits<{
    (e: 'click', candidate: Candidate): void;
}>();

const baseURL = useRuntimeConfig().public.apiBase + '/../storage/';
const isActive = ref(props.active);

watch(
    () => props.active,
    (newVal) => {
        isActive.value = newVal;
    },
);

const handleClick = () => {
    isActive.value = !isActive.value;
    emit('click', props.candidate);
};
</script>

<template>
    <div>
        <UiCard
            :class="{
                'hover:outline hover:scale-105':
                    !props.active && !props.display,
                'border-0 outline scale-105': props.active,
                'cursor-pointer': !props.display,
            }"
            class="overflow-hidden transition w-full"
            @click="handleClick"
        >
            <div class="grid">
                <div
                    :class="{ outline: props.active }"
                    class="h-full flex flex-col"
                >
                    <UiAspectRatio
                        :ratio="1"
                        class="relative border-b border-dashed border-white"
                    >
                        <img
                            :src="baseURL + candidate.picture"
                            :alt="candidate.first_name"
                            class="w-full h-full object-cover"
                        />
                        <div class="absolute bottom-0 right-0 p-4">
                            <div
                                class="w-10 h-10 flex items-center justify-center font-bold bg-white rounded-full"
                            >
                                <p class="text-gray-500">
                                    {{ candidate.order }}
                                </p>
                            </div>
                        </div>
                    </UiAspectRatio>
                    <UiCardHeader>
                        <UiCardTitle class="text-sm text-center">
                            <div v-if="!candidate.second" class="text-center">
                                {{ candidate.first_name }}
                            </div>
                            <ul v-else>
                                <li>{{ candidate.first_name }}</li>
                                <li class="text-muted-foreground">&</li>
                                <li>{{ candidate.second_name }}</li>
                            </ul>
                        </UiCardTitle>
                    </UiCardHeader>
                </div>
            </div>
        </UiCard>
    </div>
</template>
