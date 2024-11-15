<script lang="ts" setup>
const loading = ref(false);

// Pastikan signOut hanya dipanggil ketika diperlukan (misalnya logout user)
const auth = useAuth();
auth.signOut();

const signIn = async (email: string, password: string) => {
    loading.value = true;

    try {
        // Pastikan fetchCookie hanya dipanggil jika diperlukan
        await fetchCookie();

        const { data, error } = await useApiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (error?.value) {
            useAlertStore().show('Email atau password tidak sesuai!', 'error');
            loading.value = false;
            return;
        }

        // Simpan data login user setelah berhasil login
        auth.signIn(data.value);

        // Navigasi ke halaman admin setelah login berhasil
        navigateTo('/admin');
    } catch (e) {
        // Tangani error jaringan atau kesalahan lainnya
        useAlertStore().show('Terjadi kesalahan. Silakan coba lagi.', 'error');
        loading.value = false;
    }
};
</script>

<template>
    <div class="h-[calc(100dvh)] flex items-center justify-center">
        <AdminLoginCard :loading="loading" @sign-in="signIn" />
    </div>
</template>
