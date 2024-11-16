import { useFetch as useFetchCore } from '@vueuse/core';

export const fetchCookie = async () => {
    const config = useRuntimeConfig();

    try {
        // Fetch CSRF cookie from backend
        const { data, error } = await useFetchCore(
            config.public.apiBase + '/../sanctum/csrf-cookie',
            {
                credentials: 'include',
            },
        );

        if (error.value) {
            console.error('Failed to fetch CSRF cookie:', error.value);
            throw new Error('Failed to fetch CSRF cookie');
        }

        const token = useCookie('XSRF-TOKEN')?.value;
        console.log('CSRF token:', token);
        if (!token) {
            throw new Error('CSRF token not found in cookies');
        }

        return token;
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
        throw error;
    }
};

export const useApiFetch = async (url: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig();

    const token = await fetchCookie();

    const isMultipart = options.body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': token,
    };

    if (!isMultipart) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    let response;
    let errorCtx = null;

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
        throw error;
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
        console.error('Server error (500) encountered');
        useAlertStore().show('Server error. Please try again later.', 'error');
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

    console.log('API fetch response:', response);
    return response;
};
