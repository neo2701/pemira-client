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

defineEmits<{
    (e: 'click', candidate: Candidate): void;
}>();

const baseURL = useRuntimeConfig().public.apiBase + '/../storage/';
</script>

<template>
    <UiCard
        :class="{
            'hover:outline hover:scale-105': !active && !display,
            'border-0 outline': active,
            'cursor-pointer': !display,
        }"
        class="overflow-hidden transition"
        @click="$emit('click', candidate)"
    >
        <div
            :class="{ 'grid-cols-2': active && candidate.first !== '-' }"
            class="grid"
        >
            <div :class="{ outline: active }">
                <UiAspectRatio :ratio="1" class="relative">
                    <img
                        :src="baseURL + candidate.picture"
                        :alt="candidate.first_name"
                        class="w-full h-full object-cover"
                    />
                    <div class="absolute bottom-0 right-0 p-4">
                        <div
                            class="w-10 h-10 flex items-center justify-center font-bold bg-white rounded-full"
                        >
                            {{ candidate.order }}
                        </div>
                    </div>
                    <div
                        v-if="candidate.first === '-'"
                        class="absolute top-0 right-0 p-2"
                    >
                        <UiTooltipProvider>
                            <UiTooltip>
                                <UiTooltipTrigger>
                                    <div
                                        class="w-10 h-10 flex items-center justify-center text-gray-400"
                                    >
                                        <Icon
                                            name="fluent:info-16-filled"
                                            size="24"
                                        />
                                    </div>
                                </UiTooltipTrigger>
                                <UiTooltipContent>
                                    Opsi untuk memilih pilihan selain paslon no
                                    1
                                </UiTooltipContent>
                            </UiTooltip>
                        </UiTooltipProvider>
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
            <div
                v-if="active && candidate.first !== '-'"
                class="flex flex-col gap-4 p-4 text-xs"
            >
                <div>
                    <div class="font-bold">Visi:</div>
                    <div>{{ candidate.vision }}</div>
                </div>
                <div>
                    <div class="font-bold">Misi:</div>
                    <div class="whitespace-pre-wrap">
                        {{ candidate.mission }}
                    </div>
                </div>
            </div>
        </div>
    </UiCard>
</template>
