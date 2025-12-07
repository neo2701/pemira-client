<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { usePemiraConfig } from '@/composables/usePemiraConfig';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { useTypingEffect } from '@/composables/useTypingEffect';
import StartCard from '@/components/StartCard.vue';

const { year } = usePemiraConfig();

// Typing effect for hero title
const heroTitle =
    'Collaboration, Innovation, and Dedication:\nBuilding Progressive Informatics';
const typing = useTypingEffect(heroTitle, 40);

// Scroll reveal hooks for sections
const candidatesReveal = useScrollReveal();
const bljReveal = useScrollReveal();
const tutorialReveal = useScrollReveal();

// Flip card state for candidate
const isFlipped = ref(false);

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
};

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
    if (!isDown.value) return;
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
        <div v-else class="flex flex-col bg-background">
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
                        PEMIRA IF {{ year }}
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
                    class="scroll-m-[80px] flex items-center justify-center bg-background min-h-[calc(90vh-10rem)] w-full md:min-h-[calc(100vh-8rem)]"
                >
                    <div class="w-full max-w-6xl text-center px-4 sm:px-6">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            class="w-[10rem] md:w-32 aspect-square mx-auto mb-6"
                        />
                        <h1
                            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-10 bg-gradient-to-b from-[#fe7646] to-[#ee523c] bg-clip-text text-transparent min-h-[4.5rem] sm:min-h-[5.5rem] md:min-h-[6.5rem] lg:min-h-[7.5rem] leading-normal px-2 sm:px-4 md:px-6 pb-1"
                        >
                            <span
                                v-html="
                                    typing.displayedText.value.replace(
                                        /\n/g,
                                        '<br/>',
                                    )
                                "
                            ></span>
                            <span
                                v-if="typing.isTyping.value"
                                class="typing-cursor"
                                >|</span
                            >
                        </h1>
                        <p
                            class="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-10 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 break-words"
                        >
                            Vote for the best candidate to build a brighter
                            future for everyone.
                        </p>
                        <div class="group relative inline-flex">
                            <div
                                class="absolute -inset-px rounded-xl bg-gradient-to-r from-[#ee523c] via-[#fe7646] to-[#ee523c] opacity-40 blur-lg transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-70 group-hover:duration-500"
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
                    ref="candidatesReveal.elementRef"
                    class="bg-muted min-h-[calc(100vh-4rem)] w-full px-4 py-[3rem] mt-[6rem] scroll-m-[100px]"
                    :class="{
                        'opacity-0 translate-y-8': !candidatesReveal.isVisible,
                        'opacity-100 translate-y-0': candidatesReveal.isVisible,
                    }"
                    style="
                        transition:
                            opacity 0.6s ease-out 0.2s,
                            transform 0.6s ease-out 0.2s;
                    "
                >
                    <h2
                        class="text-4xl md:text-4xl lg:text-5xl font-bold text-primary text-center"
                    >
                        <span class="text-white">Calon</span>

                        <span
                            class="bg-gradient-to-tl from-[#fe7646] to-[#ee523c] bg-clip-text text-transparent"
                        >
                            Kandidat
                        </span>
                    </h2>

                    <h3
                        class="text-center text-xl md:text-2xl font-semibold text-gray-400 mb-[3rem] mt-[1rem]"
                    >
                        Ketua Himatifa &amp; Wakil Ketua Himatifa
                    </h3>

                    <!-- Candidate Card -->
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="flex justify-center">
                            <!-- Single Card -->
                            <div
                                class="flip-card w-full max-w-2xl"
                                :class="{ flipped: isFlipped }"
                                @click="toggleFlip"
                            >
                                <div class="flip-card-inner">
                                    <!-- Front Side - Photo & Names -->
                                    <div
                                        class="flip-card-front bg-card rounded-xl overflow-hidden border border-border shadow-xl cursor-pointer"
                                    >
                                        <div
                                            class="relative w-full h-[500px] md:h-[600px] flex flex-col"
                                        >
                                            <!-- Photo Section -->
                                            <div
                                                class="relative flex-1 bg-muted flex items-center justify-center overflow-hidden"
                                            >
                                                <div
                                                    class="absolute inset-0 bg-gradient-to-r from-[#ee523c] via-[#fe7646] to-[#ee523c] opacity-10 blur-2xl transition-opacity duration-300"
                                                ></div>
                                                <img
                                                    src="/KAHIMA/cakahima.webp"
                                                    alt="Kandidat KAHIMA"
                                                    class="relative z-10 w-full h-full object-contain p-4"
                                                />
                                            </div>

                                            <!-- Names Section -->
                                            <div
                                                class="p-6 md:p-8 bg-card border-t border-border"
                                            >
                                                <div
                                                    class="text-center space-y-3"
                                                >
                                                    <div class="space-y-2">
                                                        <h2
                                                            class="text-xl md:text-2xl lg:text-3xl font-bold text-primary leading-tight"
                                                        >
                                                            Jonathan Teguh
                                                            Samuel Kaeng
                                                        </h2>
                                                        <div
                                                            class="text-base md:text-lg text-muted-foreground"
                                                        >
                                                            &amp;
                                                        </div>
                                                        <h2
                                                            class="text-xl md:text-2xl lg:text-3xl font-bold text-primary leading-tight"
                                                        >
                                                            Rizky Fadilatul Dwi
                                                            Saputra
                                                        </h2>
                                                    </div>
                                                    <p
                                                        class="text-xs md:text-sm text-muted-foreground mt-4"
                                                    >
                                                        Klik untuk melihat visi
                                                        &amp; misi
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Back Side - Vision & Mission -->
                                    <div
                                        class="flip-card-back bg-card rounded-xl overflow-hidden border border-border shadow-xl cursor-pointer"
                                    >
                                        <div
                                            class="w-full h-[500px] md:h-[600px] p-4 md:p-6 lg:p-8 flex flex-col justify-start space-y-4 md:space-y-6 overflow-y-auto"
                                        >
                                            <!-- Vision -->
                                            <div
                                                class="space-y-2 md:space-y-3 flex-shrink-0"
                                            >
                                                <div
                                                    class="flex items-center gap-2"
                                                >
                                                    <div
                                                        class="w-1 h-6 md:h-8 bg-gradient-to-b from-[#fe7646] to-[#ee523c] rounded-full flex-shrink-0"
                                                    ></div>
                                                    <h3
                                                        class="text-lg md:text-xl lg:text-2xl font-bold text-primary"
                                                    >
                                                        Visi
                                                    </h3>
                                                </div>
                                                <p
                                                    class="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed pl-3"
                                                >
                                                    Mengembangkan HIMATIFA
                                                    sebagai wadah yang
                                                    memfasilitasi, menggerakkan,
                                                    dan memberdayakan keluarga
                                                    Mahasiswa Informatika agar
                                                    lebih aktif dan berprestasi
                                                    serta berkontribusi positif
                                                    bagi masyarakat.
                                                </p>
                                            </div>

                                            <!-- Divider -->
                                            <div
                                                class="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent flex-shrink-0"
                                            ></div>

                                            <!-- Mission -->
                                            <div
                                                class="space-y-2 md:space-y-3 flex-shrink-0"
                                            >
                                                <div
                                                    class="flex items-center gap-2"
                                                >
                                                    <div
                                                        class="w-1 h-6 md:h-8 bg-gradient-to-b from-[#fe7646] to-[#ee523c] rounded-full flex-shrink-0"
                                                    ></div>
                                                    <h3
                                                        class="text-lg md:text-xl lg:text-2xl font-bold text-primary"
                                                    >
                                                        Misi
                                                    </h3>
                                                </div>
                                                <p
                                                    class="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed pl-3"
                                                >
                                                    1. Mewujudkan HIMATIFA
                                                    sebagai sumber informasi
                                                    yang relevan, cepat, dan
                                                    terpercaya bagi peningkatan
                                                    kualitas keluarga Mahasiswa
                                                    Informatika.<br />2.
                                                    Mewujudkan HIMATIFA sebagai
                                                    wadah pengembangan yang
                                                    aktif mendorong peningkatan
                                                    soft skill dan hard skill
                                                    keluarga Mahasiswa
                                                    Informatika.<br />
                                                    3. Menjadikan HIMATIFA
                                                    sebagai pendorong keluarga
                                                    Mahasiswa Informatika agar
                                                    lebih terlibat dalam bidang
                                                    akademik, non akademik,
                                                    sosial, dan teknologi.
                                                </p>
                                            </div>

                                            <!-- Back indicator -->
                                            <p
                                                class="text-xs text-muted-foreground text-center mt-auto pt-2 flex-shrink-0"
                                            >
                                                Klik untuk kembali
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- BLJ Kandidat Section -->
                <section
                    id="blj"
                    ref="bljReveal.elementRef"
                    class="flex flex-col items-center justify-center py-6 bg-muted"
                    :class="{
                        'opacity-0 translate-y-8': !bljReveal.isVisible,
                        'opacity-100 translate-y-0': bljReveal.isVisible,
                    }"
                    style="
                        transition:
                            opacity 0.6s ease-out 0.2s,
                            transform 0.6s ease-out 0.2s;
                    "
                >
                    <div
                        class="items-center justify-center flex flex-col py-8 md:py-6 px-6 md:px-10 w-[900px] max-w-4xl mb-10"
                    >
                        <h2
                            class="text-4xl md:text-4xl lg:text-5xl font-bold text-primary text-center"
                        >
                            <span class="text-white">Calon</span>
                            <span
                                class="bg-gradient-to-tl from-[#fe7646] to-[#ee523c] bg-clip-text text-transparent"
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
                            class="relative scroll-smooth w-[300px] lg:w-[947px] flex items-center justify-center overflow-x-auto snap-x snap-mandatory mt-[1rem]"
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
                                class="flex w-full transition-transform duration-500 ease-out gap-4"
                            >
                                <!-- Main Slides -->
                                <UiCard
                                    v-for="(slide, index) in slides"
                                    :key="index"
                                    class="flex-shrink-0 w-[300px] flex snap-start flex-col items-center bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border"
                                >
                                    <UiAspectRatio
                                        :ratio="1"
                                        class="relative border-b border-border pb-0.2 overflow-hidden"
                                    >
                                        <img
                                            :src="slide.image"
                                            alt="BLJ Image"
                                            class="object-cover w-full h-full rounded-t-md transition-transform duration-300 hover:scale-105"
                                        />
                                    </UiAspectRatio>
                                    <UiCardHeader>
                                        <UiCardTitle>
                                            <h3
                                                class="text-base md:text-xl font-semibold text-center text-card-foreground"
                                            >
                                                {{ slide.name }}
                                            </h3>
                                        </UiCardTitle>
                                        <UiCardDescription>
                                            <p
                                                class="text-sm md:text-base text-muted-foreground text-center"
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
                                class="bg-gradient-to-br from-[#ee523c] to-[#fe7646] text-primary-foreground rounded-full p-3 md:p-4 shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive transition-all duration-300"
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
                                class="bg-gradient-to-br from-[#ee523c] to-[#fe7646] text-primary-foreground rounded-full p-3 md:p-4 shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive transition-all duration-300"
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
                    ref="tutorialReveal.elementRef"
                    class="flex flex-col items-center justify-center w-full py-12 px-4 mb-[2rem] scroll-m-[50px]"
                    :class="{
                        'opacity-0 translate-y-8': !tutorialReveal.isVisible,
                        'opacity-100 translate-y-0': tutorialReveal.isVisible,
                    }"
                    style="
                        transition:
                            opacity 0.6s ease-out 0.2s,
                            transform 0.6s ease-out 0.2s;
                    "
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <h2 class="text-4xl md:text-4xl lg:text-5xl font-bold">
                            <span class="text-white">Video </span>
                            <span class="text-white">Tutorial</span>
                        </h2>
                        <h3
                            class="text-center text-xl md:text-2xl font-semibold text-gray-400 mb-[3rem] mt-[1rem]"
                        >
                            Pemilihan Raya Informatika {{ year }}
                        </h3>

                        <div
                            class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div class="aspect-video">
                                <iframe
                                    src="https://www.youtube.com/embed/o2s_vdQNlW4?si=_Aqh-QU-v0zYI9Mv"
                                    class="absolute inset-0 w-full h-full rounded-lg"
                                    frameborder="0"
                                    referrerpolicy="strict-origin-when-cross-origin"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="bg-muted py-10 justify-items-center">
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
                                        >PEMIRA IF {{ year }}</span
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
                                                class="hover:text-primary transition-colors duration-200"
                                                >Vote Now</a
                                            >
                                        </li>
                                        <li class="mb-4">
                                            <a
                                                href="#candidates"
                                                class="hover:text-primary transition-colors duration-200"
                                                >The Candidates</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                href="#tutorial"
                                                class="hover:text-primary transition-colors duration-200"
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
                                                href="https://www.instagram.com/pemiraif2026"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="hover:text-primary transition-colors duration-200"
                                                >Instagram</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                href="https://wa.me/6287864934849"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="hover:text-primary transition-colors duration-200"
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
                                            <a
                                                href="#"
                                                class="hover:text-primary transition-colors duration-200"
                                                >Privacy Policy</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                class="hover:text-primary transition-colors duration-200"
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
                                >© {{ year }}
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

/* Prevent text from being cut off */
h1,
h2,
h3,
p {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}

/* Ensure text containers have proper spacing */
#hero h1 {
    line-height: 1.3;
    word-break: keep-all;
    overflow-wrap: break-word;
    white-space: pre-line;
    overflow: visible;
}

#hero h1 span {
    white-space: pre-line;
}

/* Typing cursor animation */
.typing-cursor {
    display: inline-block;
    background: linear-gradient(to bottom, #fe7646, #ee523c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: blink 1s infinite;
    font-weight: 300;
    margin-left: 2px;
}

@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}

/* Flip Card Styles */
.flip-card {
    perspective: 1000px;
    width: 100%;
    height: 500px;
}

@media (min-width: 768px) {
    .flip-card {
        height: 600px;
    }
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.flip-card-back {
    transform: rotateY(180deg);
}

/* Scrollbar styling for card back */
.flip-card-back > div {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground)) transparent;
}

.flip-card-back > div::-webkit-scrollbar {
    width: 6px;
}

.flip-card-back > div::-webkit-scrollbar-track {
    background: transparent;
}

.flip-card-back > div::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground));
    border-radius: 3px;
}

.flip-card-back > div::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--primary));
}

/* Smooth scroll reveal animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
