export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon',
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
            Inter: true,
        },
    },
});
