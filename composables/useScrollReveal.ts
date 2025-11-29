import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export const useScrollReveal = () => {
    const isVisible = ref(false);
    const elementRef = ref<HTMLElement | null>(null);

    const checkVisibility = () => {
        if (!elementRef.value) return;

        const rect = elementRef.value.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Element is visible when it enters the viewport (with 100px offset)
        const isInViewport = rect.top < windowHeight - 100 && rect.bottom > 0;

        if (isInViewport && !isVisible.value) {
            isVisible.value = true;
        }
    };

    onMounted(() => {
        checkVisibility();
        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility, { passive: true });
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', checkVisibility);
        window.removeEventListener('resize', checkVisibility);
    });

    return {
        elementRef,
        isVisible,
    };
};

