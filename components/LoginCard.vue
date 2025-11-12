<script lang="ts" setup>
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'signIn'): void;
}>();

const router = useRouter();
const goBack = () => {
    router.push('/');
};

const { year } = usePemiraConfig();
</script>

<template>
    <UiCard class="max-w-sm w-full bg-transparent border-none">
        <UiCardHeader class="pt-10 text-center">
            <img
                src="/logo.png"
                alt="Logo"
                class="w-32 h-32 aspect-square mx-auto"
            />
            <div class="grid gap-2">
                <div>
                    <h2 class="text-3xl">PEMIRA IF {{ year }}</h2>
                    <div class="text-sm font-bold">Himatifa {{ year }}</div>
                </div>
                <UiCardDescription>
                    Universitas Pembangunan Nasional "Veteran" Jawa Timur
                </UiCardDescription>
            </div>
        </UiCardHeader>
        <UiCardHeader class="grid gap-4 md:border-t">
            <Alert />
            <div class="flex items-center gap-2">
                <UiButton
                    size="lg"
                    class="gap-2 p-2 hover:bg-accent hover:text-accent-foreground"
                    @click="goBack"
                >
                    <Icon name="mdi:arrow-left" size="16"></Icon>
                    <span class="hidden md:inline">Kembali</span>
                </UiButton>
                <UiButton
                    size="lg"
                    class="flex-1 gap-2 flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
                    @click="emit('signIn')"
                >
                    <Icon name="bxl:google" size="16"></Icon>
                    Masuk dengan Google
                </UiButton>
            </div>
        </UiCardHeader>
    </UiCard>
</template>
