<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '@/composables/useAuth';
import StartCard from '@/components/StartCard.vue';

const auth = useAuth();
const user = ref(auth.user());
const loading = ref(false);

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
    { immediate: true },
);

const cancel = async () => {
    loading.value = true;
    try {
        await auth.signOut();
        navigateTo('/login');
    } finally {
        loading.value = false;
    }
};

const fetchSlides = async () => {
    try {
        const response = await fetch('/BLJ.json');
        if (!response.ok)
            throw new Error(
                `Failed to fetch JSON data: ${response.statusText}`,
            );

        const data = await response.json();
        if (Array.isArray(data)) {
            slides.value = data.map((slide) => ({
                image: slide.image || '',
                name: slide.name || 'Unknown',
                angkatan: slide.angkatan || 'N/A',
            }));
        } else {
            console.warn('Unexpected data format:', data);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching slides:', error.message);
        } else {
            console.error('Error fetching slides:', error);
        }
    }
};

const computedSlideCount = computed(() => slides.value.length);

const nextSlide = () => {
    if (computedSlideCount.value > 0) {
        currentIndex.value = (currentIndex.value + 1) % computedSlideCount.value;
    }
};

const prevSlide = () => {
    if (computedSlideCount.value > 0) {
        currentIndex.value =
            (currentIndex.value - 1 + computedSlideCount.value) %
            computedSlideCount.value;
    }
};


const startAutoSlide = () => {
    if (autoSlideInterval) stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 4000);
};

const stopAutoSlide = () => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
};

const isScrolled = ref(false);
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolled.value = window.scrollY > 50;
    }, 100);
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
        <!-- User Logged In State -->
        <div
            v-if="user"
            class="min-h-screen flex flex-col items-center justify-center text-center p-4"
        >
            <StartCard :user="user" :loading="loading" @cancel="cancel" />
        </div>

        <!-- Landing Page for Non-Logged In Users -->
        <div v-else class="flex flex-col bg-[#282d35]">
            <!-- Responsive Header -->
            <header
                :class="{
                    'bg-transparent': !isScrolled,
                    'bg-primary-foreground shadow-sm': isScrolled,
                }"
                class="sticky top-0 w-full transition-all duration-300 z-[60]"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8 md:py-10 py-14 max-w-7xl mx-2"
                >
                    <div class="text-3xl font-bold text-primary">PEMIRA</div>
                    <button
                        @click="navigateTo('/login')"
                        class="font-bold bg-destructive text-destructive-foreground px-4 md:px-6 py-4 md:py-2 rounded-full hover:bg-accent transition-all duration-200 text-lg md:text-base"
                    >
                        Vote Now
                    </button>
                </nav>
            </header>

            <main class="flex-1">
                <!-- Hero Section -->
                <section
                    id="home"
                    class="flex items-center justify-center bg-[#282d35] md:min-h-[calc(100vh-8rem)] min-h-[calc(100vh-0rem)] w-full"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <img
                            src="/logo_pemira24.png"
                            alt="Logo"
                            class="w-44 md:w-32 md:h-32 aspect-square mx-auto mb-6"
                        />
                        <h1
                            class="text-6xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 md:mb-6"
                        >
                            Crowning Valor<br />A Legacy of Leadership
                        </h1>
                        <p
                            class="text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-3xl mx-auto px-4"
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
                                class="relative inline-flex px-12 md:px-10 py-5 md:py-3 bg-destructive text-destructive-foreground text-xl md:text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Vote Now
                            </button>
                        </div>
                    </div>
                </section>

                <!-- KAHIMA Section -->
                <section
                    id="kahima1"
                    class="flex items-center justify-center bg-[#282d35] min-h-[calc(100vh-4rem)] w-full px-4"
                >
                    <h2
                        class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center"
                    >
                        Kandidat KAHIMA 2025
                    </h2>
                </section>

                <!-- BLJ Kandidat Section -->
                <section
                    class="flex flex-col items-center justify-center bg-[#282d35] w-full py-12 px-4 border-b-2"
                >
                    <UiCard
                        class="items-center justify-center flex flex-col py-8 md:py-10 px-6 md:px-10 w-full max-w-4xl"
                    >
                        <h2
                            class="text-4xl font-bold text-primary text-center mb-4"
                        >
                            Kandidat BLJ 2025
                        </h2>
                        <p
                            class="text-lg text-gray-400 mb-6 md:mb-8 text-center max-w-xl"
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
                currentIndex * (100 / 3)
            }%)`,
        }"
    >
        <div
            v-for="(slide, index) in slides"
            :key="index"
            class="flex-shrink-0 w-1/3 flex flex-col items-center p-4  "
        >
            <img
                :src="slide.image"
                alt="BLJ Image"
                class="w-32 h-32 md:w-40 md:h-40 rounded-sm mb-4 object-cover"
            />
            <h3
                class="text-xl md:text-xl font-semibold text-center"
            >
                {{ slide.name }}
            </h3>
            <p
                class="text-xl md:text-base text-gray-400 text-center"
            >
                Angkatan {{ slide.angkatan }}
            </p>
        </div>
    </div>

    <!-- Navigation Buttons -->
  <!-- Navigation Buttons -->
<button
    @click="prevSlide"
    class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/70 to-primary/90 text-white rounded-full p-3 md:p-4 shadow-lg hover: hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
>
    <Icon
        name="oui:arrow-left"
        class="w-5 h-5 md:w-6 md:h-6"
    ></Icon>
</button>

<button
    @click="nextSlide"
    class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/70 to-primary/90 text-white rounded-full p-3 md:p-4 shadow-lg hover: hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
>
    <Icon
        name="oui:arrow-right"
        class="w-5 h-5 md:w-6 md:h-6"
    ></Icon>
</button>

                        </div>

                    </UiCard>
                </section>

                <!-- Video Tutorial Section -->
                <section
                    class="flex flex-col items-center justify-center bg-background w-full py-12 px-4"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <h6
                            class="text-4xl md:text-4xl font-semibold text-primary mb-8 md:mb-10 [line-height:3rem] md:[line-height:2.5rem]"
                        >
                            Video Tutorial Website PEMIRA 2025
                        </h6>

                        <div
                            class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg"
                        >
                            <div class="aspect-w-16 aspect-h-9">
                                <iframe
                                    src="https://drive.google.com/file/d/1i7Y2DXZuB51AF5l6LMgfnuonqgg-FnPD/preview"
                                    allow="autoplay"
                                    class="absolute inset-0 w-full h-full rounded-lg"
                                    frameborder="0"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </NuxtLayout>
</template>

<style scoped>
/* Aspect ratio utility for responsive iframe */
.aspect-w-16 {
    position: relative;
    width: 100%;
}
.aspect-w-16 > * {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.aspect-h-9 {
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
</style>
