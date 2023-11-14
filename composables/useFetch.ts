import { useFetch as useFetchCore } from '@vueuse/core';

const fetchCookie = async () => {
    const config = useRuntimeConfig();

    await useFetchCore(config.public.apiBase + '/../sanctum/csrf-cookie', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return useCookie('XSRF-TOKEN')?.value;
};

export const useFetch = async (url: string, options) => {
    let token = useCookie('XSRF-TOKEN')?.value;

    if (!token) token = await fetchCookie();

    const config = useRuntimeConfig();

    return await useFetchCore(config.public.apiBase + url, {
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': token,
        },
    }).json();
};
