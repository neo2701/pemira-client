<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue';
import { useElectionStore } from '@/stores/election';
import { useRouter } from 'vue-router';

const electionStore = useElectionStore();
const router = useRouter();
const loading = ref(false);
const auth = useAuth();

const rules =
    '1. Masuk ke website PEMIRA INFORMATIKA\n2. Login menggunakan akun google UPN (Jika  bukan  email UPN maka akses tidak diizinkan/Ditolak)\n3. Selesaikan proses verifikasi (wajib foto langsung menggunakan camera, tidak bisa membuka gallery, dilarang memakai masker dan kacamata hitam dan wajah harus jelas)\n4. Mengupload KTM dengan syarat wajah harus jelas, foto KTM harus full tidak terpotong\n5. Proses pemilihan calon berisi foto calon, visi & misi, lalu pemilihan calon\n6. Pemilihan calon BLJ dibagi menjadi 3:\n   a. Pemilihan calon 2022\n   b. Pemilihan calon 2023\n   c. Pemilihan calon 2024\n7. Pemilihan calon Kahima & Wakahima\n8. Pemilihan selesai dan masuk ke halaman Selamat dan Terima kasih\n9. Setelah halaman Selamat dan Terimakasih pemilih WAJIB me-logout akun email yang telah digunakan\n\nNote: \n1. Jika sudah memilih/coblos, maka akan langsung diarahkan ke halaman Selamat dan terimakasih (dipastikan tidak bisa mencoblos lagi)\n2. Apabila setelah login di web pemira user tidak segera menggunakan hak pilihnya/idle selama 5 menit, maka sesi login user akan berakhir dan dialihkan ke halaman login untuk memasukan data diri dari awal\n3. Proses verifikasi ktm dan wajah secara manual saat pengesahan ';

const user = ref(auth.user());
watch(
    () => auth.user(),
    (newUser) => {
        user.value = newUser;
    },
);

const avatarSrc = computed(() => {
    return user.value?.picture || '/default_avatar.jpg';
});

const imageLoading = ref(true);
const imageError = ref(false);

const handleImageError = () => {
    imageLoading.value = false;
    imageError.value = true;
};

const isOpen = ref(false);

watchEffect(async () => {
    try {
        await electionStore.getEvent(1);
        isOpen.value = Boolean(electionStore.event?.is_open ?? false);
    } catch (error) {
        console.error('Failed to get event:', error);
        isOpen.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
});

const disabled = computed(() => {
    if (!electionStore.event) {
        return true;
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return true;
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return false;
    } else {
        return true;
    }
});

const buttonText = computed(() => {
    if (!electionStore.event) {
        return 'Pemilihan belum dimulai';
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at !== null
    ) {
        return 'Pemilihan sudah ditutup';
    } else if (
        electionStore.event?.open_election_at !== null &&
        electionStore.event?.close_election_at === null
    ) {
        return 'Mulai Pemilihan';
    } else {
        return 'Pemilihan belum dimulai';
    }
});

const start = async () => {
    if (!user.value) {
        router.push('/login');
        return;
    }

    loading.value = true;

    try {
        const done = await electionStore.checkUserStatus();
        loading.value = false;

        if (done) {
            router.push('/election/done');
        } else {
            router.push('/election/1');
        }
    } catch (error) {
        console.error('Error during election process:', error);
        loading.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
};

const cancel = async () => {
    try {
        await auth.signOut();
        router.push('/login');
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Terjadi kesalahan saat logout, silakan coba lagi.');
    }
};

const { year } = usePemiraConfig();
</script>

<template>
    <UiCard class="max-w-sm w-full bg-transparent border-none">
        <UiCardHeader class="text-center">
            <h2 class="text-3xl">PEMIRA IF {{ year }}</h2>
            <UiCardDescription class="text-sm mt-0">
                Selamat datang!
            </UiCardDescription>
        </UiCardHeader>

        <UiCardContent class="flex flex-col gap-6 items-center">
            <UiAvatar size="lg" class="relative">
                <div
                    v-if="imageLoading"
                    class="absolute inset-0 flex items-center justify-center rounded-full"
                >
                    <Icon
                        name="line-md:loading-twotone-loop"
                        class="animate-spin aspect-square h-12 text-slate-600"
                    />
                </div>
                <UiAvatarImage
                    :src="avatarSrc"
                    @load="imageLoading = false"
                    @error="handleImageError"
                    :class="{
                        'opacity-0': imageLoading,
                        'opacity-100': !imageLoading,
                    }"
                />
                <UiAvatarFallback v-if="imageError">User</UiAvatarFallback>
            </UiAvatar>
            <UiCardDescription class="text-center">
                Sebagai:
                <div class="text-slate-100 font-bold mt-1">
                    {{ user?.name || 'Pengguna' }}
                </div>
            </UiCardDescription>
        </UiCardContent>

        <UiCardFooter class="w-full grid gap-2 text-center text-black">
            <ConfirmRulesDialog
                :title="`TATA CARA PEMILIHAN CALON PEMIRA INFORMATIKA ${year}`"
                :description="
                    !disabled
                        ? rules
                        : 'Pemilihan belum dimulai, Anda tidak bisa melanjutkan pemilihan.'
                "
                cancelText="Kembali"
                confirmText="Lanjut"
                @confirm="start"
            >
                <UiButton
                    :loading="loading"
                    :disabled="disabled"
                    size="lg"
                    class="w-full bg-primary text-primary-foreground transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:bg-accent hover:text-accent-foreground"
                >
                    {{ buttonText }}
                </UiButton>
            </ConfirmRulesDialog>

            <UiCardDescription>Atau</UiCardDescription>

            <UiButton
                :disabled="loading"
                size="lg"
                variant="outline"
                class="w-full hover:bg-accent bg-primary hover:text-accent-foreground"
                @click="cancel"
            >
                <Icon name="material-symbols:logout" size="16"></Icon>
                Keluar
            </UiButton>
        </UiCardFooter>
    </UiCard>
</template>
