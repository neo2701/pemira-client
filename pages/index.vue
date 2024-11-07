<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const user = useAuth().user();
const electionStore = useElectionStore();

const loading = ref(false);
const electionDone = ref(false); // State untuk status pemilihan selesai

const cancel = () => {
    useAuth().signOut();
    navigateTo('/login');
};

const start = async () => {
    // Pengecekan autentikasi dan status pemilihan saat tombol diklik, bukan saat onMounted
    if (!user) {
        navigateTo('/login'); // Arahkan ke login jika pengguna belum login
        return;
    }

    loading.value = true;
    await electionStore.getEvent(1);
    const done = await electionStore.checkUserStatus();
    loading.value = false;

    if (done) {
        navigateTo('/election/done');
    } else {
        navigateTo('/election/1');
    }
};
</script>

<template>
    <NuxtLayout>
        <div
            v-if="user"
            class="grow flex flex-col items-center justify-center text-center p-6"
        >
            <!-- Header dan Deskripsi Landing Page -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang di Sistem Pemilihan
                </h1>
                <p class="text-gray-600">
                    Ini adalah halaman awal untuk memulai proses pemilihan.
                    Silakan lanjutkan untuk memilih atau melihat hasilnya.
                </p>
            </div>

            <!-- Komponen StartCard -->
            <StartCard :user="user" :loading="loading" @cancel="cancel" />

            <!-- Tombol untuk melanjutkan ke pemilihan -->
            <button
                v-if="!loading"
                @click="start"
                class="mt-6 px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
            >
                {{ electionDone ? 'Lihat Hasil Pemilihan' : 'Mulai Pemilihan' }}
            </button>
        </div>

        <!-- Pesan jika pengguna belum login -->
        <div
            v-else
            class="grow flex items-center justify-center text-center p-6"
        >
            <p class="text-gray-600">
                Anda harus login terlebih dahulu untuk melanjutkan ke pemilihan.
            </p>
            <button
                @click="navigateTo('/login')"
                class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
            >
                Login
            </button>
        </div>
    </NuxtLayout>
</template>

<style scoped>
/* Styling tambahan untuk landing page */
.grow {
    min-height: 100vh;
    background-color: #f9fafb;
}

h1 {
    color: #1f2937; /* Warna teks utama */
}

p {
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #4b5563; /* Warna teks deskripsi */
}
</style>
