<script lang="ts" setup>
definePageMeta({
    layout: 'main',
    ssr: false, // Menonaktifkan SSR untuk halaman ini
});

const isProcessing = ref(true);
const auth = useAuth();
const route = useRoute();
const router = useRouter();

const getAccessToken = () => {
    try {
        console.group('🔍 Token Extraction Debug');
        console.log('Full Route:', route);
        console.log('Route Hash:', route.hash);
        console.log('Route Query:', route.query);

        let token;

        // Cek hash terlebih dahulu
        if (route.hash) {
            const cleanHash = route.hash.replace(/^#/, ''); // Membersihkan '#' pada hash
            console.log('Clean Hash:', cleanHash);

            const hashParams = new URLSearchParams(cleanHash);
            token = hashParams.get('access_token'); // Mengambil access_token dari hash

            console.log('Token from Hash:', token);
        }

        // Jika tidak ada di hash, cek query
        if (!token && route.query.access_token) {
            token = route.query.access_token as string; // Mengambil access_token dari query
            console.log('Token from Query:', token);
        }

        console.log('Final Extracted Token:', token);
        console.groupEnd();

        return token; // Mengembalikan token
    } catch (error) {
        console.error('❌ Error in token extraction:', error);
        return undefined; // Mengembalikan undefined jika terjadi error
    }
};

const handleOAuthLogin = async () => {
    try {
        // Set processing flag
        isProcessing.value = true;

        // Ekstrak token
        const accessToken = getAccessToken();

        // Logging untuk debugging
        console.group('🚀 OAuth Login Process');
        console.log('Extracted Access Token:', accessToken);

        // Validasi token
        if (!accessToken) {
            console.warn('❗ No access token found');

            // Navigasi balik ke login dengan pesan error
            await router.push({
                path: '/login',
                query: {
                    error: 'No access token',
                    detail: JSON.stringify({
                        hash: route.hash,
                        query: route.query,
                    }),
                },
            });

            return;
        }

        // Validasi panjang token minimal
        if (accessToken.length < 20) {
            console.error('❌ Invalid token length');

            await router.push({
                path: '/login',
                query: {
                    error: 'Invalid token',
                    tokenLength: accessToken.length.toString(),
                },
            });

            return;
        }

        // Kirim token ke server
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                accessToken,
                // Tambahan informasi debugging
                sourceUrl: window.location.href,
            }),
        });

        console.log('Server Response:', { data, error });

        // Validasi respon server
        if (error.value) {
            console.error('❌ Server Login Error:', error.value);

            await router.push({
                path: '/login',
                query: {
                    error: 'Server login failed',
                    serverError: JSON.stringify(error.value),
                },
            });

            return;
        }

        // Proses login berhasil
        if (data.value) {
            console.log('✅ Login Successful');

            // Simpan data login
            auth.signIn(data.value);

            // Bersihkan URL
            if (process.client) {
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname, // Hanya menyisakan path tanpa parameter URL
                );
            }

            // Navigasi ke halaman utama
            await router.push('/');
        }
    } catch (err) {
        console.error('❌ Unexpected Login Error:', err);

        await router.push({
            path: '/login',
            query: {
                error: 'Unexpected error',
                details: JSON.stringify(err),
            },
        });
    } finally {
        isProcessing.value = false;
        console.groupEnd();
    }
};

// Gunakan watch untuk mendeteksi perubahan
watch(
    () => route.hash,
    (newHash) => {
        console.log('🔄 Route Hash Changed:', newHash);
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
