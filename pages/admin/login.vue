<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(false);
const auth = useAuth();

const signIn = async (email: string, password: string) => {
    loading.value = true;

    try {
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (error?.value) {
            // Log error dengan format lebih informatif
            console.group('Sign-In Error');
            console.error('Endpoint:', '/auth/login');
            console.error('Status:', error.value?.status || 'Unknown');
            console.error(
                'Message:',
                error.value?.message || 'No message provided',
            );
            console.error('Details:', error.value);
            console.groupEnd();

            useAlertStore().show('Email atau password tidak sesuai!', 'error');
            loading.value = false;
            return;
        }

        auth.signIn(data.value);

        navigateTo('/admin');
    } catch (e: any) {
        // Log unexpected errors
        console.group('Unexpected Error During Sign-In');
        console.error('Message:', e.message || 'No message available');
        console.error('Stack:', e.stack || 'No stack trace available');
        console.error('Details:', e);
        console.groupEnd();

        useAlertStore().show('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
        loading.value = false; // Pastikan loading dihentikan dalam semua kasus
    }
};
</script>

<template>
    <div class="h-[calc(100dvh)] flex items-center justify-center">
        <!-- Menampilkan AdminLoginCard dengan state loading -->
        <AdminLoginCard :loading="loading" @sign-in="signIn" />
    </div>
</template>
