<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const alert = useAlertStore();

// Log error query jika ada
if (route.query.error) {
    console.group('Route Query Error');
    console.warn('Error query parameter:', route.query.error);
    console.groupEnd();

    alert.show(route.query.error as string, 'error');
}

const signIn = () => {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        client_id: runtimeConfig.public.googleClientId as string,
        redirect_uri: runtimeConfig.public.googleRedirectUrl as string,
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        include_granted_scopes: 'true',
        prompt: 'consent',
    };

    // Log parameter untuk debugging
    console.group('Google OAuth 2.0 Parameters');
    console.log('Client ID:', params.client_id);
    console.log('Redirect URI:', params.redirect_uri);
    console.log('Response Type:', params.response_type);
    console.log('Scope:', params.scope);
    console.groupEnd();

    // Buat URL autentikasi
    const authUrl = new URL(url);
    authUrl.searchParams.append('client_id', params.client_id);
    authUrl.searchParams.append('redirect_uri', params.redirect_uri);
    authUrl.searchParams.append('response_type', params.response_type);
    authUrl.searchParams.append('scope', params.scope);
    authUrl.searchParams.append(
        'include_granted_scopes',
        params.include_granted_scopes,
    );
    authUrl.searchParams.append('prompt', params.prompt);

    // Log URL final
    console.group('Google OAuth URL');
    console.log('Generated URL:', authUrl.toString());
    console.groupEnd();

    window.open(authUrl.toString(), '_self');
};
</script>

<template>
    <NuxtLayout>
        <div class="grow flex items-center justify-center">
            <LoginCard @signIn="signIn" />
        </div>
    </NuxtLayout>
</template>
