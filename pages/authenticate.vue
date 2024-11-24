<script lang="ts" setup>
definePageMeta({
    layout: 'main',
    // Tandai halaman ini untuk client-side rendering
    ssr: false,
});

const isProcessing = ref(true);
const auth = useAuth();

// Pindahkan logika ke composable terpisah
const handleOAuthLogin = async () => {
    const route = useRoute();

    let accessToken: string | undefined;

    // Gunakan getAccessToken helper
    const getAccessToken = () => {
        if (route.hash) {
            const hashParams = new URLSearchParams(route.hash.substring(1));
            return hashParams.get('access_token') || undefined;
        }
        return route.query.access_token as string | undefined;
    };

    try {
        accessToken = getAccessToken();

        if (!accessToken) {
            console.warn('Access token not found');
            await navigateTo('/login');
            return;
        }

        // Log untuk debugging
        if (process.dev) {
            console.group('OAuth Login Info');
            console.log('Access Token:', accessToken);
            console.groupEnd();
        }

        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
        });

        if (error.value || !data.value) {
            const errorMessage =
                data.value?.message || error.value?.message || 'Unknown error';
            throw new Error(errorMessage);
        }

        auth.signIn(data.value);
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

// Gunakan watch untuk mendeteksi perubahan route
const route = useRoute();
watch(
    () => [route.hash, route.query],
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
