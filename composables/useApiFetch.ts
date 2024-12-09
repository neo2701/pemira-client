import { useFetch as useFetchCore } from '@vueuse/core';

// Fungsi untuk membuat header API dengan token CSRF
const createApiHeaders = (token: string, options: RequestInit = {}) => {
    const isMultipart = options.body instanceof FormData;
    const defaultHeaders: Record<string, string> = {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': token,
    };

    if (!isMultipart) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    return {
        ...defaultHeaders,
        ...options.headers,
    };
};

// Fungsi untuk mengambil CSRF cookie dari backend
const fetchCookie = async () => {
    const config = useRuntimeConfig();

    try {
        // Ambil CSRF cookie dari backend
        const { data, error } = await useFetchCore(
            config.public.apiBase + '/../sanctum/csrf-cookie',
            {
                credentials: 'include',
            },
        );

        if (error.value) {
            throw new Error('Failed to fetch CSRF cookie');
        }

        const token = useCookie('XSRF-TOKEN')?.value;
        if (!token) {
            throw new Error('CSRF token not found in cookies');
        }

        return token;
    } catch (error) {
        throw error;
    }
};

// Fungsi utama untuk melakukan fetch API dengan CSRF token
export const useApiFetch = async (url: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig();

    try {
        // Ambil token CSRF terlebih dahulu
        const token = await fetchCookie();
        // Buat headers API dengan token CSRF
        const headers = createApiHeaders(token, options);

        // Lakukan request API dengan pengaturan yang telah dibuat
        const response = await useFetchCore(config.public.apiBase + url, {
            credentials: 'include',
            ...options,
            headers,
        }).json();

        // Menangani status code tertentu dan memberikan respons sesuai
        if (response?.statusCode?.value === 401) {
            useAuth().signOut();
            const route = useRoute();
            const loginPath = route.fullPath.includes('/admin')
                ? '/admin/login'
                : '/login';
            navigateTo(loginPath);
        } else if (response?.statusCode?.value === 500) {
            useAlertStore().show(
                'Server error. Please try again later.',
                'error',
            );
        } else if (response?.statusCode?.value === 403) {
            useAlertStore().show(
                'You do not have permission to access this resource.',
                'error',
            );
        } else if (response?.statusCode?.value === 404) {
            useAlertStore().show('Requested resource not found.', 'error');
        }

        return response;
    } catch (error) {
        throw error;
    }
};
