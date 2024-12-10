export default defineNuxtConfig({
    // Menetapkan metadata di head tag
    app: {
        head: {
            title: 'PEMIRA Informatika 2025',
            meta: [
                {
                    name: 'description',
                    content: 'Aplikasi untuk pemilihan raya Informatika 2025',
                },
            ],
            link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
        },
    },

    // Menambahkan file CSS utama
    css: ['~/assets/css/main.css'],

    // Menonaktifkan devtools di production
    devtools: { enabled: true },

    // Menonaktifkan SSR (Single Page Application)
    ssr: false,

    // Konfigurasi runtimeConfig untuk akses ke environment variables
    runtimeConfig: {
        public: {
            // API base URL untuk frontend (akses di klien)
            apiBase: process.env.API_BASE,

            // Google OAuth configuration
            googleClientId: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL,

            // Variabel build untuk mengidentifikasi build atau environment
            build: process.env.BUILD,
        },
    },

    // Mengimport tipe data TypeScript
    imports: {
        dirs: ['~/types'], // Pastikan folder ini ada
    },

    // Mengonfigurasi modul Nuxt
    modules: [
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon',
        '@vee-validate/nuxt',
        '@nuxt/image',
    ],

    // Menambahkan komponen otomatis
    components: [
        {
            path: '~/components',
        },
        {
            path: '~/components/ui',
            extensions: ['.vue'],
            prefix: 'Ui', // Menggunakan prefix 'Ui' untuk komponen di folder ui
        },
    ],

    // Mengonfigurasi font Google
    googleFonts: {
        families: {
            Inter: [400, 500, 600, 700, 800, 900],
        },
    },

    // Mengonfigurasi PostCSS dengan TailwindCSS dan Autoprefixer
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
