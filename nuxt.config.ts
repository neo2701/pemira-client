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
    tailwindcss: {
        exposeConfig: true,
    },
    googleFonts: {
        families: {
            Inter: true,
        },
    },
});
