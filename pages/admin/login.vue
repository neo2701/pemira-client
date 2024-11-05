<script lang="ts" setup>
const loading = ref(false);

useAuth().signOut();

const signIn = async (email: string, password: string) => {
    loading.value = true;

    await fetchCookie();

    const { data, error } = await useApiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (error.value) {
        useAlertStore().show('Email atau password tidak sesuai!', 'error');
        loading.value = false;
        return;
    }

    useAuth().signIn(data.value);
    navigateTo('/admin');
};
</script>

<template>
    <div class="h-[calc(100dvh)] flex items-center justify-center">
        <AdminLoginCard :loading="loading" @sign-in="signIn" />
    </div>
</template>
