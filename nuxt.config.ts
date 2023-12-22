export default defineNuxtConfig({
    app: {
        head: {
            title: 'PEMIRA 2024',
        },
    },
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    ssr: false,
    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE,
        },
    },
    imports: {
        dirs: ['~/types'],
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon',
        '@vee-validate/nuxt',
        "@nuxt/image"
    ],
    components: [
        {
            path: '~/components',
        },
        {
            path: '~/components/ui',
            extensions: ['.vue'],
            prefix: 'Ui',
        },
    ],
    tailwindcss: {
        exposeConfig: true,
    },
    googleFonts: {
        families: {
            Inter: [400, 500, 600, 700, 800, 900],
        },
    },
});