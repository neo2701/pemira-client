<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'signIn'): void;
}>();
</script>

<template>
    <UiCard class="w-96">
        <UiCardHeader class="grid gap-4 pt-10 text-center">
            <div>
                <UiAvatar size="lg">
                    <UiAvatarFallback>PDD 🙏</UiAvatarFallback>
                </UiAvatar>
            </div>
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
        <UiCardHeader class="grid gap-4 border-t">
            <UiButton size="lg" class="w-full gap-2" @click="emit('signIn')">
                <Icon name="bxl:google" size="16"></Icon>
                Masuk dengan Google
            </UiButton>
        </UiCardHeader>
    </UiCard>
</template>
