<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount  } from 'vue';
import { useAuth } from '@/composables/useAuth';
import StartCard from '@/components/StartCard.vue';


const auth = useAuth();
const user = ref(auth.user());
const loading = ref(false);
const electionDone = ref(false);

const slides = ref([]); 
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

// Lifecycle hooks
onMounted(async () => {
    await fetchSlides(); 
    startAutoSlide();
});

onBeforeUnmount(() => {
    stopAutoSlide();
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
        <div v-else class="flex flex-col h-screen">
            <header
                class="sticky top-0 w-full bg-primary-foreground shadow-sm z-50"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8"
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
                    class="flex items-center justify-center bg-background h-[calc(100vh-4rem)] w-full border-b-2"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <h1
                            class="text-5xl md:text-7xl font-bold text-primary mb-6"
                        >
                            Crowning Valor<br />A Legacy of Leadership
                        </h1>
                        <p
                            class="text-xl md:text-2xl text-secondary mb-10 max-w-3xl mx-auto"
                        >
                            Vote for the best candidate to build a brighter
                            future for everyone.
                        </p>
                        <button
                            @click="navigateTo('/login')"
                            class="px-10 py-3 bg-destructive text-destructive-foreground text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Vote Now
                        </button>
                    </div>
                </section>
   <section class="flex flex-col items-center justify-center bg-background w-full py-12  border-b-2">
    <h2 class="text-4xl font-bold text-primary ">Kandidat BLJ 2025</h2>
    <p class="text-lg text-gray-600 mb-8 text-center">
        Daftar kandidat yang mencalonkan diri sebagai BLJ Angkatan 2025.
    </p>

    <div class="relative flex items-center justify-center w-full max-w-4xl overflow-hidden">
        
        

        <!-- Slides -->
        <div
            class="flex w-full transition-transform duration-500"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
            <div
                v-for="(slide, index) in slides"
                :key="index"
                class="flex-shrink-0 w-full flex flex-col items-center p-4"
            >
                <img
                    :src="slide.image"
                    alt="BLJ Image"
                    class="w-40 h-40 rounded-sm  mb-4"
                />
                <h3 class="text-xl font-semibold">{{ slide.name }}</h3>
                <p class="text-gray-500">Angkatan {{ slide.angkatan }}</p>
                
            </div>
        </div>

        <!-- Tombol navigasi kiri -->
        <button
            @click="prevSlide"
            class="absolute left-2 bg-primary rounded-full p-3 shadow-md hover:bg-gray-500 transition"
        >
            <i class="text-background"><</i>
        </button>

        <!-- Tombol navigasi kanan -->
        <button
            @click="nextSlide"
            class="absolute right-2 bg-primary rounded-full p-3 shadow-md hover:bg-gray-500 transition"
        >
            <i class="text-background">></i>
        </button>
        
    </div>
</section>

    <section class="flex flex-col items-center justify-center bg-background h-auto w-full  py-12"
>
    <div class="w-full max-w-6xl text-center px-4">
        <!-- Judul -->
        <h6 class="text-4xl md:text-4xl font-semibold text-primary mb-6">
            Video Tutorial Website PEMIRA 2025
        </h6>

        <!-- Pembungkus iframe -->
        <div class="relative w-full rounded-lg overflow-hidden shadow-lg mb-6">
            <iframe
                src="https://drive.google.com/file/d/1i7Y2DXZuB51AF5l6LMgfnuonqgg-FnPD/preview"
                allow="autoplay"
                class="w-full h-[500px] md:h-[600px] rounded-lg"
                frameborder="0"
                allowfullscreen
            ></iframe>
        </div>

      

        <!-- Informasi Channel -->
       
    </div>
</section>


            </main>
            
        </div>
    </NuxtLayout>
</template>
