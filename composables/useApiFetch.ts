import { useFetch as useFetchCore } from '@vueuse/core';

export const fetchCookie = async () => {
    const config = useRuntimeConfig();

    await useFetchCore(config.public.apiBase + '/../sanctum/csrf-cookie', {
        credentials: 'include',
    });

    return useCookie('XSRF-TOKEN', {
        httpOnly: config.public.build === 'production',
    })?.value;
};

export const useApiFetch = async (url: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig();
    let token = useCookie('XSRF-TOKEN', {
        httpOnly: config.public.build === 'production',
    })?.value;

    if (!token) token = await fetchCookie();

    const isMultipart = options.body instanceof FormData;
    const defaultHeaders = {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': token ?? '',
    } as Record<string, string>;

    if (!isMultipart) defaultHeaders['Content-Type'] = 'application/json';

    let errorCtx = null;
    let response = await useFetchCore(
        config.public.apiBase + url,
        {
            credentials: 'include',
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        },
        {
            onFetchError(ctx) {
                errorCtx = ctx;
                return ctx;
            },
        },
    ).json();

    if (errorCtx !== null) {
        response = {
            ...response,
            data: ref((errorCtx as Record<string, unknown>).data),
        };
    }

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
