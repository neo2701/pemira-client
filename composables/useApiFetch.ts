import { useFetch as useFetchCore } from '@vueuse/core';

const fetchCookie = async () => {
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

    const response = await useFetchCore(config.public.apiBase + url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': token ?? '',
        },
        ...options,
    }).json();

    if (response.statusCode.value === 401) {
        const route = useRoute();
        const loginPath = route.fullPath.includes('/admin')
            ? '/admin/login'
            : '/login';
        navigateTo('/login');
    }

    return response;
};
