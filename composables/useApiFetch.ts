import { useFetch as useFetchCore } from '@vueuse/core';

export const fetchCookie = async () => {
    const config = useRuntimeConfig();

    await useFetchCore(config.public.apiBase + '/../sanctum/csrf-cookie', {
        credentials: 'include',
    });

    return useCookie('XSRF-TOKEN')?.value;
};

export const useApiFetch = async (url: string, options: RequestInit = {}) => {
    let token = useCookie('XSRF-TOKEN')?.value;

    if (!token) token = await fetchCookie();

    const config = useRuntimeConfig();

    const isMultipart = options.body instanceof FormData;
    const defaultHeaders = {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': token ?? '',
    } as Record<string, string>;

    if (!isMultipart) defaultHeaders['Content-Type'] = 'application/json';

    const response = await useFetchCore(config.public.apiBase + url, {
        credentials: 'include',
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    }).json();

    if (response.statusCode.value === 401) {
        useAuth().signOut();
        const route = useRoute();
        const loginPath = route.fullPath.includes('/admin')
            ? '/admin/login'
            : '/login';
        navigateTo(loginPath);
    }

    return response;
};
