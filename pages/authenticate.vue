<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

onMounted(async () => {
    const route = useRoute();

    // Log route information untuk debugging
    console.group('OAuth Login Route Info');
    console.log('Route Hash:', route.hash);
    console.log('Route Query:', route.query);
    console.groupEnd();

    let accessToken: string | undefined;

    // Ambil token dari hash atau query parameter
    if (route.hash) {
        try {
            accessToken = route.hash.split('&')[0].split('=')[1];
        } catch (err) {
            console.error('Error parsing access token from hash:', err);
        }
    } else if (route.query.access_token) {
        accessToken = route.query.access_token as string;
    }

    if (!accessToken) {
        console.warn('Access token not found. Redirecting to login.');
        navigateTo('/login');
        return;
    }

    try {
        // Log token sebelum digunakan
        console.group('Access Token');
        console.log('Token:', accessToken);
        console.groupEnd();

        // Kirim request login ke backend
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
        });

        // Tangani error dari API
        if (error.value || !data.value) {
            const errorMessage =
                data.value?.message || error.value || 'Unknown error';
            console.error('API Login Error:', errorMessage);

            navigateTo(`/login?error=${encodeURIComponent(errorMessage)}`);
            return;
        }

        // Login berhasil
        console.log('Login successful. User data:', data.value);
        useAuth().signIn(data.value);

        // Arahkan ke halaman utama
        navigateTo('/');
    } catch (err) {
        // Tangani error yang tidak terduga
        console.error('Unexpected login error:', err);
        navigateTo(
            '/login?error=Login%20failed%20due%20to%20a%20server%20error',
        );
    }
});
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
