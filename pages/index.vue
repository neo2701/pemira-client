<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '@/composables/useAuth';
import StartCard from '@/components/StartCard.vue';

const auth = useAuth();
const user = ref(auth.user());
const loading = ref(false);
const electionDone = ref(false);

const slides = ref<
    Array<{
        image: string;
        name: string;
        angkatan: string | number;
    }>
>([]);
const currentIndex = ref(0);
let autoSlideInterval: ReturnType<typeof setInterval> | null = null;

definePageMeta({
    layout: 'main',
});

watch(
    () => auth.user(),
    (newUser) => {
        user.value = newUser;
    },
);

const cancel = async () => {
    loading.value = true;
    await auth.signOut();
    loading.value = false;
    navigateTo('/login');
};

const fetchSlides = async () => {
    try {
        const response = await fetch('/BLJ.json');
        if (!response.ok) throw new Error('Failed to fetch JSON data');
        const data = await response.json();
        slides.value = data;
    } catch (error) {
        console.error('Error fetching slides:', error);
    }
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
    currentIndex.value =
        (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 4000);
};

const stopAutoSlide = () => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
};

const isScrolled = ref(false);
const handleScroll = () => {
    console.log('Scroll position:', window.scrollY); // Debugging log
    isScrolled.value = window.scrollY > 50;
};

// Lifecycle hooks
onMounted(async () => {
    await fetchSlides();
    startAutoSlide();

    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    stopAutoSlide();
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <NuxtLayout>
        <!-- If the user is logged in, show the StartCard -->
        <div
            v-if="user"
            class="h-screen flex flex-col items-center justify-center text-center"
        >
            <StartCard :user="user" :loading="loading" @cancel="cancel" />
        </div>

        <!-- If the user is not logged in, show the landing page -->
        <div v-else class="flex flex-col bg-[#282d35]">
            <header
                :class="{
                    'bg-transparent': !isScrolled,
                    'bg-primary-foreground shadow-sm': isScrolled,
                }"
                class="sticky top-0 w-full transition-all duration-300 z-[60]"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8 py-10"
                >
                    <div class="text-2xl font-bold text-primary">PEMIRA</div>
                    <button
                        @click="navigateTo('/login')"
                        class="bg-destructive text-destructive-foreground px-6 py-2 rounded-full hover:bg-accent transition-all duration-200 font-medium"
                    >
                        Vote Now
                    </button>
                </nav>
            </header>

            <main class="flex-1">
                <section
                    id="home"
                    class="flex items-center justify-center bg-[#282d35] md:h-[calc(100vh-4rem)] h-[calc(100vh-20rem)] w-full"
                >
                    <div class="w-full h-full max-w-6xl text-center px-4">
                        <img
                            src="/logo_pemira24.png"
                            alt="Logo"
                            class="md:w-32 md:h-32 w-20 h-30 aspect-square mx-auto"
                        />
                        <h1
                            class="text-4xl md:text-7xl font-bold text-primary mb-6"
                        >
                            Crowning Valor<br />A Legacy of Leadership
                        </h1>
                        <p
                            class="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
                        >
                            Vote for the best candidate to build a brighter
                            future for everyone.
                        </p>
                        <div class="group relative inline-flex">
                            <div
                                class="animate-tilt absolute -inset-px rounded-xl bg-gradient-to-r from-[#44BCFF] via-[#6ac8fb] to-[#44BCFF] opacity-70 blur-lg transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"
                            ></div>
                            <button
                                @click="navigateTo('/login')"
                                class="relative inline-flex px-10 py-3 bg-destructive text-destructive-foreground text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Vote Now
                            </button>
                        </div>
                    </div>
                </section>

                <section
                    id="kahima1"
                    class="flex items-center justify-center bg-[#282d35] h-[calc(100vh-4rem)] w-full"
                >
                    <h2 class="text-4xl font-bold text-primary">
                        Kandidat KAHIMA 2025
                    </h2>
                </section>

                <section
                    class="flex flex-col items-center justify-center bg-[#282d35] w-full py-12 border-b-2"
                >
                    <UiCard
                        class="items-center justify-center flex flex-col py-10 px-10 md:w-auto md:h-auto w-[70%]"
                    >
                        <h2 class="text-2xl md:text-4xl font-bold text-primary">
                            Kandidat BLJ 2025
                        </h2>
                        <p
                            class="text-sm md:text-lg text-gray-400 mb-8 mt-2 text-center"
                        >
                            Daftar kandidat yang mencalonkan diri sebagai BLJ
                            Angkatan 2025.
                        </p>

                        <div
                            class="relative flex items-center justify-center w-full max-w-4xl overflow-hidden"
                        >
                            <!-- Slides -->
                            <div
                                class="flex w-full transition-transform duration-500"
                                :style="{
                                    transform: `translateX(-${
                                        currentIndex * 100
                                    }%)`,
                                }"
                            >
                                <div
                                    v-for="(slide, index) in slides"
                                    :key="index"
                                    class="flex-shrink-0 w-full flex flex-col items-center p-4"
                                >
                                    <img
                                        :src="slide.image"
                                        alt="BLJ Image"
                                        class="w-40 h-40 rounded-sm mb-4"
                                    />
                                    <h3 class="text-xl font-semibold">
                                        {{ slide.name }}
                                    </h3>
                                    <p class="text-gray-400">
                                        Angkatan {{ slide.angkatan }}
                                    </p>
                                </div>
                            </div>

                            <!-- Tombol navigasi kiri -->
                            <button
                                @click="prevSlide"
                                class="absolute left-2 bg-primary rounded-full p-3 shadow-md hover:bg-gray-500 transition"
                            >
                                <Icon
                                    name="oui:arrow-left"
                                    class="text-background"
                                ></Icon>
                            </button>

                            <!-- Tombol navigasi kanan -->
                            <button
                                @click="nextSlide"
                                class="absolute right-2 bg-primary rounded-full p-3 shadow-md hover:bg-gray-500 transition"
                            >
                                <Icon
                                    name="oui:arrow-right"
                                    class="text-background"
                                ></Icon>
                            </button>
                        </div>
                    </UiCard>
                </section>

                <section
                    class="flex flex-col items-center justify-center bg-background h-auto w-full py-12"
                >
                    <div
                        class="w-full max-w-6xl text-center px-4 justify-items-center"
                    >
                        <!-- Judul -->
                        <h6
                            class="text-2xl md:text-4xl font-semibold text-primary mb-10"
                        >
                            Video Tutorial Website PEMIRA 2025
                        </h6>

                        <!-- Pembungkus iframe -->
                        <div
                            class="relative w-[80%] rounded-lg overflow-hidden shadow-lg mb-6"
                        >
                            <iframe
                                src="https://drive.google.com/file/d/1i7Y2DXZuB51AF5l6LMgfnuonqgg-FnPD/preview"
                                allow="autoplay"
                                class="w-full h-[500px] md:h-[600px] rounded-lg"
                                frameborder="0"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </NuxtLayout>
</template>

<style scoped></style>
