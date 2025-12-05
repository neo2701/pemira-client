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
 * Ekstrak authorization code dari URL query.
 * @returns Authorization code atau undefined jika tidak ditemukan.
 */
const getAuthorizationCode = (): string | undefined => {
    return route.query.code as string;
};

/**
 * Clear all cookies and get fresh CSRF token
 */
const clearCookiesAndGetCsrf = async () => {
    const config = useRuntimeConfig();

    try {
        // Clear all cookies
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name =
                eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie =
                name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }

        // Get fresh CSRF token
        await $fetch(config.public.apiBase + '/../sanctum/csrf-cookie', {
            credentials: 'include',
        });
    } catch (error) {
        console.error('Failed to clear cookies and get CSRF token:', error);
    }
};

/**
 * Proses login OAuth menggunakan authorization code.
 */
const handleOAuthLogin = async () => {
    isProcessing.value = true;

    try {
        // Clear cookies and get fresh CSRF token before authentication
        await clearCookiesAndGetCsrf();

        const authorizationCode = getAuthorizationCode();

        if (!authorizationCode || authorizationCode.length < 10) {
            await router.push({
                path: '/login',
                query: {
                    error: 'Invalid or missing authorization code',
                },
            });
            return;
        }

        // Kirim authorization code ke backend
        // Backend akan menggunakan client secret untuk menukar code dengan access token
        const { data, error, statusCode } = await useApiFetch('/auth/login', {
            method: 'POST',
            data: {
                code: authorizationCode,
                redirectUri: window.location.origin + '/authenticate',
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
                // Bersihkan URL dari authorization code
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
