<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'start'): void;
    (e: 'cancel'): void;
}>();
const props = defineProps<{
    user: User;
}>();
</script>

<template>
    <UiCard class="w-96">
        <UiCardHeader class="text-center">
            <h2 class="text-3xl">PEMIRA</h2>
            <UiCardDescription class="text-sm mt-0">
                Selamat datang!
            </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="flex flex-col gap-6 items-center">
            <UiAvatar size="lg">
                <UiAvatarImage :src="props.user.picture" />
            </UiAvatar>
            <UiCardDescription class="text-center">
                Sebagai:
                <div class="text-black font-bold">{{ props.user.name }}</div>
            </UiCardDescription>
            <div class="w-full grid gap-2 text-center">
                <UiButton size="lg" class="w-full" @click="emit('start')">
                    Mulai Pemilihan
                </UiButton>
                <UiCardDescription>Atau</UiCardDescription>
                <UiButton
                    size="lg"
                    variant="outline"
                    class="w-full"
                    @click="emit('cancel')"
                >
                    Kembali
                </UiButton>
            </div>
        </UiCardContent>
    </UiCard>
</template>
