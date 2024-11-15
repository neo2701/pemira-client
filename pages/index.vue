<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useElectionStore } from '@/stores/election';
import { useAuth } from '@/composables/useAuth';
import StartCard from '@/components/StartCard.vue';

definePageMeta({
    layout: 'main',
});

const auth = useAuth();
const user = ref(auth.user());
const electionStore = useElectionStore();

const loading = ref(false);
const electionDone = ref(false);

const cancel = () => {
    auth.signOut();
    navigateTo('/login');
};

const start = async () => {
    if (!user.value) {
        navigateTo('/login');
        return;
    }

    loading.value = true;
    
    try {
        await electionStore.getEvent(1);
        const done = await electionStore.checkUserStatus();
        loading.value = false;

        if (done) {
            navigateTo('/election/done');
        } else {
            navigateTo('/election/1');
        }
    } catch (error) {
        console.error('Error during election process:', error);
        loading.value = false;
        alert('Terjadi kesalahan, silakan coba lagi.');
    }
};

watchEffect(() => {
    if (!user.value) {
        navigateTo('/login');
    }
});
</script>

<template>
    <NuxtLayout>
        <!-- Jika user sudah login, tampilkan StartCard -->
        <div
            v-if="user"
            class="h-screen flex flex-col items-center justify-center text-center"
        >
            <StartCard :user="user" :loading="loading" @cancel="cancel" />
        </div>

        <!-- Jika user belum login, tampilkan landing page -->
        <div v-else class="flex flex-col h-screen">
            <header
                class="sticky top-0 w-full bg-primary-foreground shadow-sm z-50"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8"
                >
                    <div class="text-2xl font-bold text-primary">PEMIRA</div>
                    <button
                        @click="navigateTo('/login')"
                        class="bg-destructive text-destructive-foreground px-6 py-2 rounded-full hover:bg-accent transition-all duration-200 font-medium"
                    >
                        Vote Now
                    </button>
                </nav>
            </header>

            <main class="flex-1">
                <section
                    id="home"
                    class="flex items-center justify-center bg-background h-[calc(100vh-4rem)] w-full"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <h1
                            class="text-5xl md:text-7xl font-bold text-primary mb-6"
                        >
                            Crowning Valor<br />A Legacy of Leadership
                        </h1>
                        <p
                            class="text-xl md:text-2xl text-secondary mb-10 max-w-3xl mx-auto"
                        >
                            Vote for the best candidate to build a brighter
                            future for everyone.
                        </p>
                        <button
                            @click="start"
                            class="px-10 py-3 bg-destructive text-destructive-foreground text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Vote Now
                        </button>
                    </div>
                </section>
            </main>
        </div>
    </NuxtLayout>
</template>
