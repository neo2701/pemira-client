import { ref, onMounted, onUnmounted } from 'vue';

export const useTypingEffect = (text: string, speed: number = 40) => {
    const displayedText = ref('');
    const isTyping = ref(true);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    onMounted(() => {
        let currentIndex = 0;

        const typeText = () => {
            if (currentIndex < text.length) {
                displayedText.value = text.substring(0, currentIndex + 1);
                currentIndex++;
                timeoutId = setTimeout(typeText, speed);
            } else {
                isTyping.value = false;
            }
        };

        // Start typing after a small delay
        timeoutId = setTimeout(typeText, 500);
    });

    onUnmounted(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    return {
        displayedText,
        isTyping,
    };
};

