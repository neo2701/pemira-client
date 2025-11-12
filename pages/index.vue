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
let autoSlideInterval: { current: ReturnType<typeof setInterval> | null } = {
    current: null,
};
const loadedImages = ref<Set<string>>(new Set());

const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            loadedImages.value.add(src);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
};

definePageMeta({
    layout: 'landing',
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
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            slides.value = data.map((slide) => ({
                image: slide.image || '',
                name: slide.name || 'Unknown',
                angkatan: slide.angkatan || 'N/A',
            }));
        } else {
            slides.value = [];
        }
    } catch {
        slides.value = []; // Ensure fallback to empty state
    }
};

const nextSlide = () => {
    sliderContainer.value?.scrollBy({ left: 227, behavior: 'smooth' });
};

const prevSlide = () => {
    sliderContainer.value?.scrollBy({ left: -227, behavior: 'smooth' });
};

const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval.current = setInterval(() => {
        sliderContainer.value?.scrollBy({ left: 227, behavior: 'smooth' });
    }, 4000);
};

const currentScrollPosition = ref(0);

const stopAutoSlide = () => {
    if (sliderContainer.value) {
        currentScrollPosition.value = sliderContainer.value.scrollLeft;
        sliderContainer.value.scrollLeft = currentScrollPosition.value;
    }
    if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
        autoSlideInterval.current = null;
    }
};

const sliderContainer = ref<HTMLElement | null>(null);

const scrollHandler = () => {
    if (sliderContainer.value) {
        const { scrollLeft, clientWidth, scrollWidth } = sliderContainer.value;
        if (scrollLeft + clientWidth >= scrollWidth - 200) {
            slides.value.push(...slides.value);
        }
    }
};

const isDown = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const handleMouseDownSlide = (event: MouseEvent) => {
    isDown.value = true;
    sliderContainer.value?.classList.remove('cursor-pointer');
    sliderContainer.value?.classList.add('cursor-grabbing');
    startX.value = event.pageX - (sliderContainer.value?.offsetLeft || 0);
    scrollLeft.value = sliderContainer.value?.scrollLeft || 0;
};
const handleMouseEnterSlide = () => {
    stopAutoSlide();
    console.log(autoSlideInterval.current);
    console.log(sliderContainer.value?.scrollLeft);
    sliderContainer.value?.classList.add('cursor-pointer');
};

const handleMouseLeaveSlide = () => {
    isDown.value = false;
    sliderContainer.value?.classList.remove('cursor-grabbing');
    sliderContainer.value?.classList.remove('cursor-pointer');
    startAutoSlide();
};

const handleMouseUp = () => {
    sliderContainer.value?.classList.remove('cursor-grabbing');
    sliderContainer.value?.classList.add('cursor-pointer');
    isDown.value = false;
};

const handleMouseMove = (event: MouseEvent) => {
    const container = sliderContainer.value;
    if (!container) return;
    if(!isDown.value) return;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - startX.value) * 1.5;
    container.scrollLeft = scrollLeft.value - walk;
};

const handleTouchStart = () => {
    isDown.value = true;
    stopAutoSlide();
};
const handleTouchEnd = () => {
    isDown.value = false;
    startAutoSlide();
};

const isScrolled = ref(false);
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolled.value = window.scrollY > 10;
        scrollTimeout = null;
    }, 100);
};

// Loading state for images
const isLoading = ref(true);

// Lifecycle hooks
onMounted(async () => {
    isLoading.value = true;
    await fetchSlides();
    isLoading.value = false;
    startAutoSlide();
    window.addEventListener('scroll', handleScroll, { passive: true });
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
            <div
                :class="{
                    'bg-transparent': !isScrolled,
                    'bg-primary-foreground shadow-md': isScrolled,
                }"
                class="sticky top-0 w-full transition-all duration-300 z-[60]"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8 md:py-10 py-4 min-w-full"
                >
                    <div class="text-2xl md:text-3xl font-bold text-primary">
                        PEMIRA IF 2025
                    </div>
                    <button
                        @click="navigateTo('/login')"
                        class="font-bold bg-destructive text-destructive-foreground px-4 md:px-5 py-3 md:py-3 rounded-full hover:bg-accent transition-all duration-200 text-sm md:text-base"
                    >
                        Vote Now
                    </button>
                </nav>
            </div>

            <div class="flex-1 overflow-x-hidden">
                <!-- Hero Section -->
                <section
                    id="hero"
                    class="scroll-m-[80px] flex items-center justify-center bg-[#282d35] min-h-[calc(90vh-10rem)] w-full md:min-h-[calc(100vh-8rem)]"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            class="w-[10rem] md:w-32 aspect-square mx-auto mb-6"
                        />
                        <h1
                            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-b from-[#bee5f9] to-[#2079a9] bg-clip-text text-transparent"
                        >
                            Crowning Valor<br />A Legacy of Leadership
                        </h1>
                        <p
                            class="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-10 max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-4"
                        >
                            Vote for the best candidate to build a brighter
                            future for everyone.
                        </p>
                        <div class="group relative inline-flex">
                            <div
                                class="absolute -inset-px rounded-xl bg-gradient-to-r from-[#44BCFF] via-[#6ac8fb] to-[#44BCFF] opacity-70 blur-lg transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-500"
                            ></div>
                            <button
                                @click="navigateTo('/login')"
                                class="relative inline-flex px-6 py-3 md:px-8 md:py-4 bg-destructive text-destructive-foreground text-sm md:text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Vote Now
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Candidate Section -->
                <section
                    id="candidates"
                    class="bg-primary-foreground min-h-[calc(100vh-4rem)] w-full px-4 py-[3rem] mt-[6rem] scroll-m-[100px]"
                >
                    <h2
                        class="text-4xl md:text-4xl lg:text-5xl font-bold text-primary text-center"
                    >
                        <span class="text-white">Calon</span>

                        <span
                            class="bg-gradient-to-tl from-[#44BCFF] to-[#0a405d] bg-clip-text text-transparent"
                        >
                            Kandidat
                        </span>
                    </h2>

                    <h3
                        class="text-center text-xl md:text-2xl font-semibold text-gray-400 mb-[3rem] mt-[1rem]"
                    >
                        Ketua Himatifa &amp; Wakil Ketua Himatifa
                    </h3>

                    <div
                        class="flex flex-col items-center gap-8 px-4 md:grid md:grid-cols-2 xl:gap-16 xl:px-16"
                    >
                        <div class="relative flex items-center justify-center">
                            <div
                                class="absolute w-96 h-96 rounded-full bg-gradient-to-r from-[#44BCFF] via-[#6ac8fb] to-[#44BCFF] opacity-70 blur-3xl"
                            ></div>
                            <img
                                src="/KAHIMA/1.webp"
                                alt="Prabowo & Gibran"
                                class="relative object-cover z-10 aspect-square w-[20rem] md:w-[25rem]"
                            />
                        </div>

                        <div class="mt-[4rem]">
                            <div class="text-center text-2xl md:text-3xl">
                                <h2>I Gusti Ngurah Karunya Pratama</h2>
                                <h3 class="text-gray-500">&amp;</h3>
                                <h2>Arganta Bisma Pramata</h2>
                            </div>

                            <div
                                class="mt-5 max-w-[18rem] md:max-w-none mx-auto"
                            >
                                <h2
                                    class="md:text-lg lg:text-xl text-lg text-center"
                                >
                                    Visi :
                                </h2>
                                <p
                                    class="text-gray-300 md:text-current lg:text-lg text-base text-justify"
                                >
                                    Menjadikan Himatifa sebagai wadah yang
                                    mendukung perkembangan dan peningkatan
                                    kualitas mahasiswa informatika, serta mampu
                                    beradaptasi terhadapi lingkungan dan terbuka
                                    dengan ide baru dalam prosesnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- BLJ Kandidat Section -->
                <section
                    id="blj"
                    class="flex flex-col items-center justify-center py-6 bg-primary-foreground"
                >
                    <div
                        class="items-center justify-center flex flex-col py-8 md:py-6 px-6 md:px-10 w-full max-w-4xl mb-10"
                    >
                        <h2
                            class="text-4xl md:text-4xl lg:text-5xl font-bold text-primary text-center"
                        >
                            <span class="text-white">Calon</span>
                            <span
                                class="bg-gradient-to-tl from-[#44BCFF] to-[#0a405d] bg-clip-text text-transparent"
                            >
                                Kandidat
                            </span>
                        </h2>
                        <h3
                            class="text-center text-xl md:text-2xl font-semibold text-gray-400 mb-[3rem] mt-[1rem]"
                        >
                            Badan Legislatif Jurusan
                        </h3>

                        <!-- Loading State -->
                        <div
                            v-if="isLoading"
                            class="w-full flex justify-center items-center py-20"
                        >
                            <div
                                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                            ></div>
                        </div>

                        <!-- Slider Content -->
                        <div
                            v-else
                            class="relative scroll-smooth w-[300px] md:w-full flex items-center justify-center overflow-x-auto snap-x snap-mandatory mt-[1rem]"
                            ref="sliderContainer"
                            @scroll="scrollHandler"
                            @mousedown.prevent="handleMouseDownSlide($event)"
                            @mouseleave="handleMouseLeaveSlide"
                            @mouseenter="handleMouseEnterSlide"
                            @mouseup="handleMouseUp"
                            @mousemove="handleMouseMove($event)"
                            @touchstart="handleTouchStart"
                            @touchend="handleTouchEnd"
                        >
                            <div
                                class="flex w-full transition-transform duration-500 ease-out space-x-4"
                            >
                                <!-- Main Slides -->
                                <UiCard
                                    v-for="(slide, index) in slides"
                                    :key="index"
                                    class="flex-shrink-0 w-full md:w-1/3 flex snap-start flex-col items-center bg-[#ffffff]"
                                >
                                    <UiAspectRatio
                                        :ratio="1"
                                        class="relative border-b border-white pb-0.2"
                                    >
                                        <img
                                            :src="slide.image"
                                            alt="BLJ Image"
                                            class="object-cover w-full h-full rounded-t-md transition-opacity duration-300"
                                        />
                                    </UiAspectRatio>
                                    <UiCardHeader>
                                        <UiCardTitle>
                                            <h3
                                                class="text-base md:text-xl font-semibold text-center text-gray-500"
                                            >
                                                {{ slide.name }}
                                            </h3>
                                        </UiCardTitle>
                                        <UiCardDescription>
                                            <p
                                                class="text-sm md:text-base text-gray-400 text-center"
                                            >
                                                Angkatan {{ slide.angkatan }}
                                            </p>
                                        </UiCardDescription>
                                    </UiCardHeader>
                                </UiCard>
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div
                            class="flex justify-center gap-5 items-center mx-auto w-full px-[2rem] md:px-[8rem] translate-y-full"
                        >
                            <button
                                @click="prevSlide"
                                @mouseenter="stopAutoSlide"
                                @mouseleave="startAutoSlide"
                                class="bg-gradient-to-br from-primary/70 to-primary/90 text-white rounded-full p-3 md:p-4 shadow-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                            >
                                <Icon
                                    name="oui:arrow-left"
                                    class="w-5 h-5 md:w-6 md:h-6"
                                />
                            </button>

                            <button
                                @click="nextSlide"
                                @mouseenter="stopAutoSlide"
                                @mouseleave="startAutoSlide"
                                class="bg-gradient-to-br from-primary/70 to-primary/90 text-white rounded-full p-3 md:p-4 shadow-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                            >
                                <Icon
                                    name="oui:arrow-right"
                                    class="w-5 h-5 md:w-6 md:h-6"
                                />
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Video Tutorial Section -->
                <section
                    id="tutorial"
                    class="flex flex-col items-center justify-center w-full py-12 px-4 mb-[2rem] scroll-m-[50px]"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <h2 class="text-4xl md:text-4xl lg:text-5xl font-bold">
                            <span class="text-white">Video </span>
                            <span class="text-white">Tutorial</span>
                        </h2>
                        <h3
                            class="text-center text-xl md:text-2xl font-semibold text-gray-400 mb-[3rem] mt-[1rem]"
                        >
                            Pemilihan Raya Informatika 2025
                        </h3>

                        <div
                            class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg"
                        >
                            <div class="aspect-video">
                                <iframe
                                    src="https://www.youtube.com/embed/x7oc9-yMIeg?si=xet-HA-z5vvQoAer"
                                    class="absolute inset-0 w-full h-full rounded-lg"
                                    frameborder="0"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
                <footer
                    class="bg-primary-foreground py-10 justify-items-center"
                >
                    <div class="mx-auto w-full max-w-screen-xl px-4">
                        <div class="md:flex md:justify-between">
                            <div class="mb-6 md:mb-0">
                                <a
                                    href="#"
                                    class="flex items-center my-auto gap-4"
                                >
                                    <img
                                        src="/logo.png"
                                        class="h-[4rem]"
                                        alt="PEMIRA25 Logo"
                                    />
                                    <span
                                        class="self-center text-2xl font-semibold whitespace-nowrap"
                                        >PEMIRA IF 2025</span
                                    >
                                </a>

                                <p class="mt-3 text-gray-500">
                                    Gunakan hakmu untuk Himatifa yang lebih
                                    baik!
                                </p>
                            </div>
                            <div class="grid gap-8 md:gap-6 grid-cols-3">
                                <div>
                                    <h2
                                        class="mb-6 text-sm font-semibold uppercase"
                                    >
                                        Content
                                    </h2>
                                    <ul class="text-gray-500 font-medium">
                                        <li class="mb-4">
                                            <a
                                                href="#hero"
                                                class="hover:underline"
                                                >Vote Now</a
                                            >
                                        </li>
                                        <li class="mb-4">
                                            <a
                                                href="#candidates"
                                                class="hover:underline"
                                                >The Candidates</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                href="#tutorial"
                                                class="hover:underline"
                                                >Video Tutorial</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2
                                        class="mb-6 text-sm font-semibold uppercase"
                                    >
                                        Follow us
                                    </h2>
                                    <ul class="text-gray-500 font-medium">
                                        <li class="mb-4">
                                            <a
                                                href="https://www.instagram.com/pemiraif2025"
                                                class="hover:underline"
                                                >Instagram</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                href="https://wa.me/6281283635565"
                                                class="hover:underline"
                                                >Whatsapp</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2
                                        class="mb-6 text-sm font-semibold uppercase"
                                    >
                                        Legal
                                    </h2>
                                    <ul class="text-gray-500 font-medium">
                                        <li class="mb-4">
                                            <a href="#" class="hover:underline"
                                                >Privacy Policy</a
                                            >
                                        </li>
                                        <li>
                                            <a href="#" class="hover:underline"
                                                >Terms &amp; Conditions</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <hr
                            class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"
                        />
                        <div class="sm:flex sm:items-center sm:justify-between">
                            <span class="text-sm text-gray-500 sm:text-center"
                                >© 2025
                                <a href="#" class="hover:underline"
                                    >PEMIRA Informatika</a
                                >. All Rights Reserved.
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </NuxtLayout>
</template>

<style scoped>
.overflow-x-auto {
    overflow-x: auto;
    scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>
