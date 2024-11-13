<script lang="ts" setup>
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'signIn'): void;
}>();

const router = useRouter();
const goBack = () => {
    router.push('/');
};
</script>

<template>
    <UiCard class="max-w-sm w-full bg-transparent border-none">
        <UiCardHeader class="pt-10 text-center">
            <img
                src="/logo_pemira24.png"
                alt="Logo"
                class="w-32 h-32 aspect-square mx-auto"
            />
            <div class="grid gap-2">
                <div>
                    <h2 class="text-3xl">PEMIRA</h2>
                    <div class="text-sm font-bold">
                        HIMA KM Informatika 2025
                    </div>
                </div>
                <UiCardDescription>
                    Universitas Pembangunan Nasional "Veteran" Jawa Timur
                </UiCardDescription>
            </div>
        </UiCardHeader>
        <UiCardHeader class="grid gap-4 md:border-t">
            <Alert />
            <!-- Button Container -->
            <div class="flex items-center gap-2">
                <!-- Back Button: Icon only on mobile, label on desktop -->
                <UiButton
                    size="lg"
                    class="gap-2 p-2 hover:bg-[#8e94a0]"
                    @click="goBack"
                >
                    <Icon name="mdi:arrow-left" size="16"></Icon>
                    <span class="hidden md:inline">Kembali</span>
                </UiButton>
                <!-- Sign in with Google Button with nowrap text -->
                <UiButton
                    size="lg"
                    class="flex-1 gap-2 flex items-center justify-center whitespace-nowrap hover:bg-[#8e94a0]"
                    @click="emit('signIn')"
                >
                    <Icon name="bxl:google" size="16"></Icon>
                    Masuk dengan Google
                </UiButton>
            </div>
        </UiCardHeader>
    </UiCard>
</template>
