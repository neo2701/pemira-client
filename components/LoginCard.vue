<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'signIn'): void;
}>();
</script>

<template>
    <UiCard class="max-w-sm w-full">
        <UiCardHeader class="pt-10 text-center">
            <img
                src="/logo.png"
                alt="Logo"
                class="w-32 h-32 aspect-square mx-auto"
            />
            <div class="grid gap-2">
                <div>
                    <h2 class="text-3xl">PEMIRA</h2>
                    <div class="text-sm font-bold">
                        HIMA KM Informatika 2024
                    </div>
                </div>
                <UiCardDescription>
                    Universitas Pembangunan Nasional "Veteran" Jawa Timur
                </UiCardDescription>
            </div>
        </UiCardHeader>
        <UiCardHeader class="grid gap-4 md:border-t">
            <Alert />
            <UiButton size="lg" class="w-full gap-2" @click="emit('signIn')">
                <Icon name="bxl:google" size="16"></Icon>
                Masuk dengan Google
            </UiButton>
        </UiCardHeader>
    </UiCard>
</template>
