<script lang="ts" setup>
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const alert = useAlertStore();

if (route.query.error) {
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

    window.open(authUrl.toString(), '_self');
};
</script>

<template>
    <NuxtLayout>
        <div class="h-[calc(100dvh)] flex items-center justify-center">
            <LoginCard @signIn="signIn" />
        </div>
    </NuxtLayout>
</template>
