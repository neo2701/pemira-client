<script lang="ts" setup>
definePageMeta({
    layout: 'main',
});

const user = useAuth().user();
const electionStore = useElectionStore();

const loading = ref(false);
const electionDone = ref(false);

const cancel = () => {
    useAuth().signOut();
    navigateTo('/login');
};

const start = async () => {
    if (!user) {
        navigateTo('/login');
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
        <!-- Login Page -->
        <div
            v-if="user"
            class="h-screen flex flex-col items-center justify-center text-center"
        >
            <StartCard :user="user" :loading="loading" @cancel="cancel" />
        </div>

        <!-- Landing Page -->
        <div v-else class="flex flex-col h-screen">
            <!-- Header -->
            <header
                class="sticky top-0 w-full bg-primary-foreground shadow-sm z-50"
            >
                <nav
                    class="flex items-center justify-between h-16 px-4 md:px-8"
                >
                    <div class="text-2xl font-bold text-primary">
                        <span>PEMIRA</span>
                    </div>
                    <div
                        class="hidden md:flex space-x-8 text-secondary-foreground"
                    >
                        <a href="#home" class="hover:text-primary font-medium"
                            >Home</a
                        >
                        <a href="#about" class="hover:text-primary font-medium"
                            >About</a
                        >
                        <a
                            href="#contribute"
                            class="hover:text-primary font-medium"
                            >Contribute</a
                        >
                        <a href="#events" class="hover:text-primary font-medium"
                            >Events</a
                        >
                        <a href="#news" class="hover:text-primary font-medium"
                            >News</a
                        >
                        <a
                            href="#contact"
                            class="hover:text-primary font-medium"
                            >Contact</a
                        >
                    </div>
                    <button
                        @click="navigateTo('/login')"
                        class="bg-destructive text-destructive-foreground px-6 py-2 rounded-full hover:bg-accent transition-all duration-200 font-medium"
                    >
                        Vote Now
                    </button>
                </nav>
            </header>

            <!-- Main Content -->
            <main class="flex-1">
                <!-- Hero Section -->
                <section
                    id="home"
                    class="flex items-center justify-center bg-background h-[calc(100vh-4rem)] w-full"
                >
                    <div class="w-full max-w-6xl text-center px-4">
                        <img
                            src="/logo_pemira24.png"
                            alt="logo"
                            class="w-32 h-32 aspect-square mx-auto"
                        />
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
                        <div
                            class="flex flex-col md:flex-row gap-4 justify-center"
                        >
                            <button
                                @click="start"
                                class="px-10 py-3 bg-destructive text-destructive-foreground text-lg font-semibold rounded-full hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Vote Now
                            </button>
                        </div>
                    </div>
                </section>

                <!-- About Section -->
                <section
                    id="about"
                    class="min-h-screen flex items-center justify-center bg-foreground w-full"
                >
                    <div class="w-full max-w-4xl text-center px-4">
                        <h2
                            class="text-4xl md:text-5xl font-bold text-primary mb-8"
                        >
                            About the Candidate
                        </h2>
                        <p
                            class="text-xl md:text-2xl leading-relaxed text-secondary"
                        >
                            Our candidate has represented Delaware for 36 years
                            in the U.S. Senate, committed to making impactful
                            changes and building a better future.
                        </p>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="bg-secondary text-secondary-foreground py-6 w-full">
                <div class="text-center px-4">
                    <p class="text-lg">
                        &copy; 2025 PEMIRA INFORMATIKA. All rights reserved.
                    </p>
                    <nav class="flex justify-center space-x-6 mt-4 text-lg">
                        <a href="#home" class="hover:text-primary">Home</a>
                        <a href="#about" class="hover:text-primary">About</a>
                        <a href="#contribute" class="hover:text-primary"
                            >Contribute</a
                        >
                        <a href="#events" class="hover:text-primary">Events</a>
                        <a href="#news" class="hover:text-primary">News</a>
                        <a href="#contact" class="hover:text-primary"
                            >Contact</a
                        >
                    </nav>
                </div>
            </footer>
        </div>
    </NuxtLayout>
</template>

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

html {
    scroll-behavior: smooth;
}

button {
    transform: translateY(0);
    transition: all 0.2s ease;
}

button:hover {
    transform: translateY(-2px);
}

section {
    transition: all 0.3s ease-in-out;
}

#home {
    background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
}
</style>
