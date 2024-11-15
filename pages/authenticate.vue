<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

onMounted(async () => {
    const route = useRoute();

    let accessToken: string | undefined;
    if (route.hash) {
        accessToken = route.hash.split('&')[0].split('=')[1];
    } else if (route.query.access_token) {
        accessToken = route.query.access_token as string;
    }

    if (!accessToken) {
        navigateTo('/login');
        return;
    }

    try {
        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
        });

        if (error.value || !data.value) {
            const errorMessage = data.value?.message || error.value;
            navigateTo(`/login?error=${encodeURIComponent(errorMessage)}`);
            return;
        }

        useAuth().signIn(data.value);
        navigateTo('/');
    } catch (err) {
        console.error('Login error:', err);
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
