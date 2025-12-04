<script lang="ts" setup>
import { usePemiraConfig } from '~/composables/usePemiraConfig';

definePageMeta({
    layout: 'main',
    ssr: false, // Menonaktifkan SSR untuk halaman ini
});

const isProcessing = ref(true);
const auth = useAuth();
const route = useRoute();
const router = useRouter();

/**
 * Ekstrak access token dari URL hash atau query.
 * @returns Access token atau undefined jika tidak ditemukan.
 */
const getAccessToken = (): string | undefined => {
    const hashParams = route.hash
        ? new URLSearchParams(route.hash.replace(/^#/, ''))
        : null;
    const tokenFromHash = hashParams?.get('access_token');
    const tokenFromQuery = route.query.access_token as string;

    return tokenFromHash || tokenFromQuery;
};

/**
 * Proses login OAuth menggunakan access token.
 */
const handleOAuthLogin = async () => {
    isProcessing.value = true;

    try {
        const accessToken = getAccessToken();

        if (!accessToken || accessToken.length < 20) {
            await router.push({
                path: '/login',
                query: {
                    error: 'Invalid or missing token',
                },
            });
            return;
        }

        const { data, error, statusCode } = await useApiFetch('/auth/login', {
            method: 'POST',
            data: {
                accessToken,
                sourceUrl: window.location.href,
            },
        });

        // Check for errors (network or HTTP errors)
        if (error.value || (statusCode.value && statusCode.value >= 400)) {
            await router.push({
                path: '/login',
                query: { error: error.value || 'Login failed' },
            });
            return;
        }

        if (data.value) {
            auth.signIn(data.value);
            if (process.client) {
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname,
                );
            }
            await router.push('/');
        }
    } catch (err) {
        await router.push({
            path: '/login',
            query: { error: 'Unexpected error' },
        });
    } finally {
        isProcessing.value = false;
    }
};

// Jalankan proses login OAuth saat halaman dimuat
onMounted(() => {
    if (process.client) {
        handleOAuthLogin();
    }
});

const { year } = usePemiraConfig();
</script>

<template>
    <NuxtLayout>
        <div class="grow flex items-center justify-center">
            <UiCard class="max-w-sm w-full bg-transparent border-none">
                <UiCardHeader class="text-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        class="w-32 h-32 aspect-square mx-auto"
                    />
                    <h2 class="text-3xl">PEMIRA IF {{ year }}</h2>
                    <div class="text-sm font-bold">Himatifa {{ year }}</div>
                    <UiCardDescription class="text-sm mt-0">
                        E-Vote Himatifa
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
