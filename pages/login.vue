<script lang="ts" setup>
const signIn = () => {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        client_id:
            '1026031797826-55q6gfg5mvjcu9u1pmt02me73g2lo5so.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/authenticate',
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
    <div class="h-[calc(100dvh)] flex items-center justify-center">
        <LoginCard @signIn="signIn" />
    </div>
</template>
