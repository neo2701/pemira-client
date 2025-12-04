<script lang="ts" setup>
import { usePemiraConfig } from '~/composables/usePemiraConfig';

definePageMeta({
    layout: 'main',
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const alert = useAlertStore();

// Tampilkan pesan error jika ada query error di URL
if (route.query.error) {
    alert.show(route.query.error as string, 'error');
}

const signIn = () => {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        client_id: runtimeConfig.public.googleClientId as string,
        redirect_uri: runtimeConfig.public.googleRedirectUrl as string,
        response_type: 'code', // Changed from 'token' to 'code' for Authorization Code Flow
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        access_type: 'offline',
        prompt: 'consent',
    };

    // Buat URL autentikasi
    const authUrl = new URL(url);
    authUrl.searchParams.append('client_id', params.client_id);
    authUrl.searchParams.append('redirect_uri', params.redirect_uri);
    authUrl.searchParams.append('response_type', params.response_type);
    authUrl.searchParams.append('scope', params.scope);
    authUrl.searchParams.append('access_type', params.access_type);
    authUrl.searchParams.append('prompt', params.prompt);

    // Arahkan pengguna ke URL Google OAuth
    window.open(authUrl.toString(), '_self');
};

const { year } = usePemiraConfig();
</script>

<template>
    <NuxtLayout>
        <div class="grow flex items-center justify-center">
            <LoginCard @signIn="signIn" />
        </div>
    </NuxtLayout>
</template>
