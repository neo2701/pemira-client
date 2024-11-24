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

        // Tangani error jika pengambilan gagal
        if (error.value) {
            console.group('Fetch CSRF Cookie Error');
            console.error(
                'Endpoint:',
                config.public.apiBase + '/../sanctum/csrf-cookie',
            );
            console.error('Error details:', error.value);
            console.groupEnd();
            throw new Error('Failed to fetch CSRF cookie');
        }

        const token = useCookie('XSRF-TOKEN')?.value;
        if (!token) {
            throw new Error('CSRF token not found in cookies');
        }

        return token;
    } catch (error) {
        console.group('CSRF Cookie Fetch Unexpected Error');
        if (error instanceof Error) {
            console.error('Message:', error.message || 'No message provided');
        } else {
            console.error('Message:', 'No message provided');
        }
        console.error('Details:', error);
        console.groupEnd();
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

        // Log respons API untuk debugging
        console.group('API Fetch Response');
        console.log('Endpoint:', config.public.apiBase + url);
        console.log('Options:', options);
        console.log('Response data:', response.data.value);
        console.groupEnd();

        // Menangani status code tertentu dan memberikan respons sesuai
        if (response?.statusCode?.value === 401) {
            console.warn('Unauthorized access - redirecting to login');
            useAuth().signOut();
            const route = useRoute();
            const loginPath = route.fullPath.includes('/admin')
                ? '/admin/login'
                : '/login';
            navigateTo(loginPath);
        } else if (response?.statusCode?.value === 500) {
            console.error('Server error (500) encountered');
            useAlertStore().show(
                'Server error. Please try again later.',
                'error',
            );
        } else if (response?.statusCode?.value === 403) {
            console.warn('Forbidden access - user may not have permissions');
            useAlertStore().show(
                'You do not have permission to access this resource.',
                'error',
            );
        } else if (response?.statusCode?.value === 404) {
            console.warn('Not Found - The requested resource does not exist');
            useAlertStore().show('Requested resource not found.', 'error');
        }

        return response;
    } catch (error) {
        // Log error untuk debugging
        console.group('API Fetch Error');
        console.error('Endpoint:', config.public.apiBase + url);
        console.error('Options:', options);
        console.error('Error details:', error);
        console.groupEnd();

        // Tangani error sesuai kebutuhan
        throw error;
    }
};
