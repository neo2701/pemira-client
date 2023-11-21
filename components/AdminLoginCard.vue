<script lang="ts" setup>
defineProps<{
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'signIn', email: string, password: string): void;
    (e: 'signInGoogle'): void;
}>();

const form = reactive({
    email: '',
    password: '',
});
</script>

<template>
    <UiCard class="w-96">
        <UiCardHeader class="text-center">
            <h2 class="text-3xl">PEMIRA</h2>
            <UiCardDescription class="text-sm mt-0">
                E-Vote HIMATIFA
            </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="grid gap-4">
            <div class="grid gap-2">
                <Alert />
                <UiLabel>Email</UiLabel>
                <UiInput
                    v-model="form.email"
                    :disabled="$props.loading"
                    type="email"
                    placeholder="Email"
                />
            </div>
            <div class="grid gap-2">
                <UiLabel>Password</UiLabel>
                <UiInput
                    v-model="form.password"
                    :disabled="$props.loading"
                    type="password"
                    placeholder="Masukkan password"
                    @keydown.enter="emit('signIn', form.email, form.password)"
                />
            </div>
            <UiButton
                :loading="$props.loading"
                class="w-full"
                @click="emit('signIn', form.email, form.password)"
            >
                Masuk
            </UiButton>
            <UiCardDescription class="text-center">atau</UiCardDescription>
            <UiButton
                :disabled="$props.loading"
                variant="outline"
                class="w-full gap-2"
                @click="emit('signInGoogle')"
            >
                <Icon name="bxl:google" size="16"></Icon>
                Masuk dengan Google
            </UiButton>
        </UiCardContent>
    </UiCard>
</template>
