export default defineNuxtConfig({
    app: {
        head: {
            title: 'PEMIRA 2025',
        },
    },

    css: ['~/assets/css/main.css'],

    devtools: { enabled: false },

    ssr: false, // Nonaktifkan SSR untuk aplikasi ini

    runtimeConfig: {
        public: {
            build: process.env.BUILD || 'development',
            apiBase: process.env.API_BASE || 'http://localhost:3000/api',
            googleClientId: process.env.GOOGLE_CLIENT_ID || '',
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL || '',
        },
    },

    imports: {
        dirs: ['~/types'], // Pastikan folder ini ada
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon',
        '@vee-validate/nuxt',
        '@nuxt/image',
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
