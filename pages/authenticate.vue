<script lang="ts" setup>
definePageMeta({
    layout: 'main',
    // Tandai halaman ini untuk client-side rendering
    ssr: false,
});

const isProcessing = ref(true);
const auth = useAuth(); // Asumsi auth composable ada

/**
 * Helper untuk mengambil access token dari hash atau query.
 */
const getAccessToken = () => {
    if (process.client && route.hash) {
        console.log('Route hash:', route.hash); // Debugging
        const hashParams = new URLSearchParams(route.hash.substring(1));
        console.log('Parsed hashParams:', hashParams); // Debugging
        return hashParams.get('access_token') || undefined;
    }
    console.warn('Access token not found in hash or query');
    return route.query.access_token as string | undefined;
};

/**
 * Fungsi untuk menangani proses login OAuth.
 */
const handleOAuthLogin = async () => {
    const route = useRoute();

    let accessToken: string | undefined;

    try {
        accessToken = getAccessToken();

        if (!accessToken) {
            console.warn('Access token not found');
            await navigateTo('/login'); // Arahkan kembali ke login jika token tidak ditemukan
            return;
        }

        // Log untuk debugging
        if (process.dev) {
            console.group('OAuth Login Info');
            console.log('Access Token:', accessToken);
            console.groupEnd();
        }

        // Kirim token ke server untuk validasi
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
        });

        if (error.value || !data.value) {
            const errorMessage =
                data.value?.message || error.value?.message || 'Unknown error';
            throw new Error(errorMessage);
        }

        // Simpan data login ke auth state (misalnya Vuex atau LocalStorage)
        auth.signIn(data.value);

        // Arahkan ke halaman utama setelah login berhasil
        await navigateTo('/');
    } catch (err) {
        console.error('Login error:', err);
        const errorMsg = encodeURIComponent(
            (err as Error).message || 'Login failed',
        );
        await navigateTo(`/login?error=${errorMsg}`); // Kirim pesan error ke halaman login
    } finally {
        isProcessing.value = false;
    }
};

// Gunakan watch untuk mendeteksi perubahan hash route
const route = useRoute();
watch(
    () => route.hash,
    () => {
        if (process.client) {
            handleOAuthLogin();
        }
    },
    { immediate: true },
);
</script>

<template>
    <NuxtLayout>
        <div class="grow flex items-center justify-center">
            <UiCard class="max-w-sm w-full bg-transparent border-none">
                <UiCardHeader class="text-center">
                    <img
                        src="/logo_pemira24.png"
                        alt="Logo"
                        class="w-32 h-32 aspect-square mx-auto"
                    />
                    <h2 class="text-3xl">PEMIRA</h2>
                    <div class="text-sm font-bold">
                        HIMA KM Informatika 2025
                    </div>
                    <UiCardDescription class="text-sm mt-0">
                        E-Vote HIMATIFA
                    </UiCardDescription>
                </UiCardHeader>
                <UiCardContent class="grid gap-4 justify-center">
                    <div class="flex justify-center">
                        <Icon name="svg-spinners:90-ring-with-bg" size="24" />
                    </div>
                    <UiCardDescription> Sedang memuat... </UiCardDescription>
                </UiCardContent>
            </UiCard>
        </div>
    </NuxtLayout>
</template>
