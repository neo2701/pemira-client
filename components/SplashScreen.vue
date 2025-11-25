<template>
    <Transition name="splash" appear>
        <div
            v-if="showSplash"
            class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
            <!-- Logo Animation Container -->
            <div class="logo-container mb-8">
                <img
                    src="/logo.png"
                    alt="Pemira Logo"
                    class="logo-image"
                />
            </div>

            <!-- Text Animation Container -->
            <div class="text-container">
                <h1 class="splash-text">
                    PEMIRA {{ year }}
                </h1>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePemiraConfig } from '@/composables/usePemiraConfig';

const { year } = usePemiraConfig();
const showSplash = ref(true);

const emit = defineEmits<{
    (e: 'splash-complete'): void;
}>();

onMounted(() => {
    // Prevent body scroll during splash screen
    document.body.style.overflow = 'hidden';
    
    // Hide splash screen after 1.8 seconds (smooth and fast)
    setTimeout(() => {
        showSplash.value = false;
        // Emit event after fade out transition completes
        setTimeout(() => {
            // Restore body scroll
            document.body.style.overflow = '';
            emit('splash-complete');
        }, 400);
    }, 1800);
});

// Expose method to manually hide splash if needed
defineExpose({
    hide: () => {
        showSplash.value = false;
        emit('splash-complete');
    },
});
</script>

<style scoped>
/* Logo Animation - Smoother with cubic-bezier */
.logo-container {
    animation: logoFadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
}

.logo-image {
    width: 150px;
    height: 150px;
    object-fit: contain;
    animation: logoBounce 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s infinite alternate;
    will-change: transform;
}

@keyframes logoFadeInScale {
    0% {
        opacity: 0;
        transform: scale(0.2) rotate(-10deg);
    }
    50% {
        opacity: 0.9;
        transform: scale(1.05) rotate(2deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}

@keyframes logoBounce {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    100% {
        transform: translateY(-8px) rotate(1deg);
    }
}

/* Text Animation - Smoother with better easing */
.text-container {
    overflow: hidden;
}

.splash-text {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(
        135deg,
        #fe7646 50%,
        #ee523c 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textSlideUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards;
    opacity: 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    will-change: transform, opacity;
}

@keyframes textSlideUp {
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.9);
    }
    60% {
        opacity: 0.8;
        transform: translateY(-5px) scale(1.02);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}


/* Transition for Splash Screen Exit - Smoother */
.splash-enter-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.splash-enter-from,
.splash-leave-to {
    opacity: 0;
}

/* Responsive Design */
@media (max-width: 640px) {
    .logo-image {
        width: 120px;
        height: 120px;
    }

    .splash-text {
        font-size: 2rem;
    }
}

@media (min-width: 1024px) {
    .logo-image {
        width: 180px;
        height: 180px;
    }

    .splash-text {
        font-size: 3.5rem;
    }
}
</style>

