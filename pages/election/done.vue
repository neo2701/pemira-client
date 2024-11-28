<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const user = useAuth().user();

const options = {
    particles: {
        color: {
            value: ['#f87171', '#facc15', '#60a5fa', '#34d399', '#a78bfa'],
        },
        move: {
            direction: 'bottom',
            enable: true,
            outModes: {
                default: 'out',
            },
            size: true,
            speed: {
                min: 1,
                max: 3,
            },
        },
        number: {
            value: 500,
            density: {
                enable: true,
                area: 800,
            },
        },
        opacity: {
            value: 1,
            animation: {
                enable: false,
                startValue: 'max',
                destroy: 'min',
                speed: 0.3,
                sync: true,
            },
        },
        rotate: {
            value: {
                min: 0,
                max: 360,
            },
            direction: 'random',
            move: true,
            animation: {
                enable: true,
                speed: 60,
            },
        },
        tilt: {
            direction: 'random',
            enable: true,
            move: true,
            value: {
                min: 0,
                max: 360,
            },
            animation: {
                enable: true,
                speed: 60,
            },
        },
        shape: {
            type: ['circle', 'square'],
            options: {},
        },
        size: {
            value: {
                min: 2,
                max: 4,
            },
        },
        roll: {
            darken: {
                enable: true,
                value: 30,
            },
            enlighten: {
                enable: true,
                value: 30,
            },
            enable: true,
            speed: {
                min: 15,
                max: 25,
            },
        },
        wobble: {
            distance: 30,
            enable: true,
            move: true,
            speed: {
                min: -15,
                max: 15,
            },
        },
    },
};

const exit = () => {
    useAuth().signOut();
    navigateTo('/');
};
</script>

<template>
    <vue-particles id="confetti" :options="options" />
    <NuxtLayout>
        <div class="grow flex items-center justify-center">
            <UiCard class="max-w-sm sm:max-w-xl sm:grid grid-cols-2">
                <div
                    class="border-white md:border-r border-b sm:border-b-0 border-dashed"
                >
                    <UiCardHeader>
                        <UiCardTitle>Selamat!</UiCardTitle>
                        <UiCardDescription>
                            {{ user?.name }}
                        </UiCardDescription>
                    </UiCardHeader>
                    <UiCardContent>
                        <UiCardDescription>
                            Terima kasih telah menggunakan hak suaramu dan
                            berpartisipasi di PEMIRA 2024.
                        </UiCardDescription>
                    </UiCardContent>
                    <UiCardFooter>
                        <UiButton class="w-full" size="lg" @click="exit">
                            Keluar
                        </UiButton>
                    </UiCardFooter>
                </div>
                <div>
                    <UiCardHeader>
                        <UiCardTitle class="flex items-center gap-2">
                            <Icon name="fluent:megaphone-24-regular" />
                            Rekapitulasi Suara!
                        </UiCardTitle>
                        <UiCardDescription>
                            Jangan lupa untuk datang di Hari Rekapitulasi Suara
                            yang akan diadakan pada:
                        </UiCardDescription>
                        <UiCardDescription>
                            <ul class="list-disc list-inside">
                                <li class="flex items-center gap-2">
                                    <Icon
                                        name="fluent:calendar-24-regular"
                                        class="shrink-0"
                                    />
                                    Jumat, 29 Desember 2023
                                </li>
                                <li class="flex items-center gap-2">
                                    <Icon
                                        name="fluent:clock-24-regular"
                                        class="shrink-0"
                                    />
                                    15:30 WIB
                                </li>
                                <li class="flex items-center gap-2">
                                    <Icon
                                        name="fluent:location-24-regular"
                                        class="shrink-0"
                                    />
                                    Ruang Seminar FIK 2
                                </li>
                                <li class="flex items-center gap-2">
                                    <Icon
                                        name="fluent:person-24-regular"
                                        class="shrink-0"
                                    />
                                    Pakaian: Bebas rapi berkerah
                                </li>
                            </ul>
                        </UiCardDescription>
                    </UiCardHeader>
                </div>
            </UiCard>
        </div>
    </NuxtLayout>
</template>
