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
    if (process.client) {
        // Pastikan hash tidak kosong
        if (route.hash) {
            // Hapus karakter '#' di awal
            const hashString = route.hash.substring(1);

            // Buat URLSearchParams dari hash
            const hashParams = new URLSearchParams(hashString);

            // Ekstrak access_token
            const accessToken = hashParams.get('access_token');

            if (accessToken) {
                console.log('Access Token ditemukan di hash');
                return accessToken;
            }
        }

        // Fallback ke query parameter jika tidak ditemukan di hash
        const queryToken = route.query.access_token as string | undefined;

        if (queryToken) {
            console.log('Access Token ditemukan di query');
            return queryToken;
        }
    }

    console.warn('Tidak ada access token yang ditemukan');
    return undefined;
};

const handleOAuthLogin = async () => {
    try {
        const accessToken = getAccessToken();

        if (!accessToken) {
            console.warn('Access token tidak ditemukan');
            await navigateTo('/login');
            return;
        }

        // Tambahkan informasi tambahan dari URL
        const hashString = route.hash.substring(1);
        const hashParams = new URLSearchParams(hashString);

        const additionalInfo = {
            tokenType: hashParams.get('token_type'),
            expiresIn: hashParams.get('expires_in'),
            scope: hashParams.get('scope'),
            authuser: hashParams.get('authuser'),
            hd: hashParams.get('hd'),
            prompt: hashParams.get('prompt'),
        };

        // Kirim token beserta informasi tambahan ke server
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                accessToken,
                ...additionalInfo,
            }),
        });

        // Proses selanjutnya sama seperti sebelumnya
        if (error.value || !data.value) {
            const errorMessage =
                data.value?.message || error.value?.message || 'Unknown error';
            throw new Error(errorMessage);
        }

        // Simpan data login
        auth.signIn(data.value);

        // Bersihkan hash dari URL
        if (process.client) {
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
        }

        // Arahkan ke halaman utama
        await navigateTo('/');
    } catch (err) {
        console.error('Login error:', err);
        const errorMsg = encodeURIComponent(
            (err as Error).message || 'Login failed',
        );
        await navigateTo(`/login?error=${errorMsg}`);
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
