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

    return await useFetchCore(config.public.apiBase + url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': token ?? '',
        },
        ...options,
    }).json();
};
