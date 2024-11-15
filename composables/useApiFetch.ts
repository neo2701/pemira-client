import { useFetch as useFetchCore } from '@vueuse/core';

export const fetchCookie = async () => {
    const config = useRuntimeConfig();

    try {
        const { data, error } = await useFetchCore(
            config.public.apiBase + '/../sanctum/csrf-cookie',
            {
                credentials: 'include',
            },
        );

        if (error.value) {
            throw new Error('Failed to fetch CSRF cookie');
        }

        return useCookie('XSRF-TOKEN')?.value;
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
        throw error;
    }
};

export const useApiFetch = async (url: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig();
    const token = await fetchCookie();

    const isMultipart = options.body instanceof FormData;
    const defaultHeaders = {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': token ?? '',
    } as Record<string, string>;

    if (!isMultipart) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    let errorCtx = null;
    let response;

    try {
        response = await useFetchCore(config.public.apiBase + url, {
            credentials: 'include',
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        }).json();
    } catch (error) {
        console.error('Error during API fetch:', error);
        throw error; // Rethrow to handle it outside if needed
    }

    if (errorCtx !== null) {
        response = {
            ...response,
            data: ref((errorCtx as Record<string, unknown>).data),
        };
    }

    if (response?.statusCode?.value === 401) {
        console.warn('Unauthorized access - redirecting to login');
        useAuth().signOut();
        const route = useRoute();
        const loginPath = route.fullPath.includes('/admin')
            ? '/admin/login'
            : '/login';
        navigateTo(loginPath);
    } else if (response?.statusCode?.value === 500) {
        console.error('Server error: 500');
        useAlertStore().show('Server error. Please try again later.', 'error');
    }

    return response;
};
