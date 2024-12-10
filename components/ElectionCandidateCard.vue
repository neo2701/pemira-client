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
const isFlipped = ref(false);
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

const flipToBack = () => {
    isFlipped.value = true;
    isActive.value = true;
    emit('click', props.candidate);
};

const flipToFront = () => {
    isFlipped.value = false;
    if (!props.display) isActive.value = false;
};
</script>

<template>
    <div class="perspective-1000">
        <div
            :class="[
                'relative transition-transform duration-700 transform-style-3d h-[450px]',
                isFlipped ? 'rotate-y-180' : '',
            ]"
        >
            <!-- Front of the card -->
            <div class="absolute backface-hidden w-full h-full">
                <UiCard
                    :class="{
                        'hover:outline hover:scale-105':
                            !isFlipped && !props.active && !props.display,
                        'border-0 outline scale-105': props.active,
                        'cursor-pointer': !props.display,
                    }"
                    class="overflow-hidden transition w-full"
                    @click="flipToBack"
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
                                    <div
                                        v-if="!candidate.second"
                                        class="text-center"
                                    >
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

            <!-- Back of the card -->
            <div class="relative backface-hidden rotate-y-180">
                <UiCard
                    :class="{
                        'hover:outline hover:scale-105':
                            isFlipped && !props.active && !props.display,
                        'border-0 outline scale-105': props.active,
                        'cursor-pointer': !props.display,
                    }"
                    class="overflow-hidden transition"
                    @click="handleClick"
                >
                    <div class="p-6 space-y-4 flex-1">
                        <div class="relative justify-items-center">
                            <div
                                class="w-10 h-10 flex items-center justify-center font-bold bg-white rounded-full"
                            >
                                <p class="text-gray-500">
                                    {{ candidate.order }}
                                </p>
                            </div>
                        </div>
                        <div class="text-md font-bold text-center">
                            <div v-if="!candidate.second" class="text-center">
                                {{ candidate.first_name }}
                            </div>
                            <ul v-else>
                                <li>{{ candidate.first_name }}</li>
                                <li class="text-muted-foreground">&</li>
                                <li>{{ candidate.second_name }}</li>
                            </ul>

                            <div
                                class="mt-4 md:mt-2 border-b border-white"
                            ></div>
                        </div>
                        <div class="overflow-y-auto h-[15rem]">
                            <div class="mb-2">
                                <h4 class="font-bold text-lg mb-2">Visi:</h4>
                                <p class="text-sm">
                                    {{ candidate.vision }}
                                </p>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg mb-2">Misi:</h4>
                                <p class="text-sm whitespace-pre-wrap">
                                    {{ candidate.mission }}
                                </p>
                            </div>
                        </div>

                        <Icon
                            name="weui:back-outlined"
                            class="absolute top-1 md:top-3 left-3 text-gray-400 hover:text-white"
                            size="30"
                            @click="flipToFront"
                        ></Icon>
                    </div>
                </UiCard>
            </div>
        </div>
    </div>
</template>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

.transform-style-3d {
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}

.overflow-y-auto {
    scrollbar-width: thin;
}

@media screen and (max-width: 768px) {
    .absolute.backface-hidden {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .relative.backface-hidden.rotate-y-180 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
}
</style>
