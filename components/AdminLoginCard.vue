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

// Menambahkan validasi sebelum emit
const handleSignIn = () => {
    if (!form.email || !form.password) {
        useAlertStore().show('Email dan password harus diisi', 'error');
        return;
    }
    emit('signIn', form.email, form.password);
};
</script>

<template>
    <UiCard
        class="flex min-h-full min-w-full flex-col justify-center px-6 py-12 lg:px-8 rounded-none bg-background"
    >
        <UiCardHeader class="text-center">
            <img
                class="w-32 h-32 aspect-square mx-auto"
                src="/logo_pemira24.png"
                alt="Logo"
            />
            <h2 class="mt-10 text-center text-3xl">PEMIRA 2024</h2>
            <UiCardDescription> Admin Login Section</UiCardDescription>
        </UiCardHeader>
        <div class="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
            <UiCardContent class="space-y-6">
                <div class="grid gap-2">
                    <Alert />
                    <UiLabel>Email address</UiLabel>
                    <UiInput
                        v-model="form.email"
                        :disabled="$props.loading"
                        type="email"
                        placeholder="Email address"
                        class="bg-input"
                    />
                </div>
                <div class="grid gap-2">
                    <UiLabel>Password</UiLabel>
                    <UiInput
                        class="bg-input"
                        v-model="form.password"
                        :disabled="$props.loading"
                        type="password"
                        placeholder="Masukkan password"
                        @keydown.enter="handleSignIn"
                    />
                </div>
            </UiCardContent>
            <UiCardFooter>
                <UiButton
                    :loading="$props.loading"
                    class="w-full hover:bg-[#8e94a0] hover:text-white"
                    @click="handleSignIn"
                >
                    <Icon
                        v-if="!$props.loading"
                        name="material-symbols:login"
                        size="20"
                    ></Icon>

                    Masuk
                </UiButton>
            </UiCardFooter>
        </div>
    </UiCard>
</template>
