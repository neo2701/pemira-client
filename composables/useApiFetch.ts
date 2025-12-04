import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
} from 'axios';

// Type untuk response wrapper
interface ApiResponse<T = any> {
    data: Ref<T | null>;
    error: Ref<string | null>;
    statusCode: Ref<number | null>;
    loading: Ref<boolean>;
}

// Buat instance axios
let axiosInstance: AxiosInstance | null = null;

const createAxiosInstance = (): AxiosInstance => {
    const config = useRuntimeConfig();

    const instance = axios.create({
        baseURL: config.public.apiBase,
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
        },
    });

    // Request interceptor untuk menambahkan CSRF token
    instance.interceptors.request.use(
        async (config) => {
            // Ambil CSRF token dari cookie
            const csrfToken = useCookie('XSRF-TOKEN').value;

            if (csrfToken) {
                config.headers['X-XSRF-TOKEN'] = csrfToken;
            }

            // Set Content-Type jika bukan FormData
            if (!(config.data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    // Response interceptor untuk menangani error global
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError<{ message?: string }>) => {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;

            // Handle specific status codes
            if (statusCode === 401) {
                useAuth().signOut();
                const route = useRoute();
                const loginPath = route.fullPath.includes('/admin')
                    ? '/admin/login'
                    : '/login';
                navigateTo(loginPath);
            } else if (statusCode === 403) {
                useAlertStore().show(
                    errorMessage ||
                        'You do not have permission to access this resource.',
                    'error',
                );
            } else if (statusCode === 404) {
                useAlertStore().show(
                    errorMessage || 'Requested resource not found.',
                    'error',
                );
            } else if (statusCode === 500) {
                useAlertStore().show(
                    errorMessage || 'Server error. Please try again later.',
                    'error',
                );
            } else if (statusCode === 400) {
                // Don't show alert for 400 by default, let component handle it
                // useAlertStore().show(errorMessage || 'Bad request.', 'error');
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

// Fungsi untuk mendapatkan instance axios
const getAxiosInstance = (): AxiosInstance => {
    if (!axiosInstance) {
        axiosInstance = createAxiosInstance();
    }
    return axiosInstance;
};

// Fungsi untuk mengambil CSRF cookie dari backend
const fetchCsrfCookie = async (): Promise<void> => {
    const config = useRuntimeConfig();
    const csrfToken = useCookie('XSRF-TOKEN').value;

    // Jika sudah ada token, tidak perlu fetch lagi
    if (csrfToken) {
        return;
    }

    try {
        await axios.get(config.public.apiBase + '/../sanctum/csrf-cookie', {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
        throw new Error('Failed to initialize CSRF protection');
    }
};

// Fungsi utama untuk melakukan API request
export const useApiFetch = async <T = any>(
    url: string,
    options: AxiosRequestConfig = {},
): Promise<ApiResponse<T>> => {
    const data = ref<T | null>(null) as Ref<T | null>;
    const error = ref<string | null>(null) as Ref<string | null>;
    const statusCode = ref<number | null>(null) as Ref<number | null>;
    const loading = ref<boolean>(true) as Ref<boolean>;

    try {
        // Pastikan CSRF cookie sudah diambil
        await fetchCsrfCookie();

        // Dapatkan axios instance
        const instance = getAxiosInstance();

        // Lakukan request
        const response: AxiosResponse<T> = await instance({
            url,
            ...options,
        });

        // Set response data
        data.value = response.data;
        statusCode.value = response.status;
        error.value = null;
    } catch (err: any) {
        const axiosError = err as AxiosError<{ message?: string }>;

        // Set error data
        statusCode.value = axiosError.response?.status || null;
        error.value =
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred';
        data.value = null;

        console.error('API Error:', {
            url,
            status: statusCode.value,
            message: error.value,
        });
    } finally {
        loading.value = false;
    }

    return {
        data,
        error,
        statusCode,
        loading,
    };
};

// Utility functions untuk HTTP methods yang umum digunakan
export const useApiGet = <T = any>(
    url: string,
    config?: AxiosRequestConfig,
) => {
    return useApiFetch<T>(url, { ...config, method: 'GET' });
};

export const useApiPost = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
) => {
    return useApiFetch<T>(url, { ...config, method: 'POST', data });
};

export const useApiPut = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
) => {
    return useApiFetch<T>(url, { ...config, method: 'PUT', data });
};

export const useApiDelete = <T = any>(
    url: string,
    config?: AxiosRequestConfig,
) => {
    return useApiFetch<T>(url, { ...config, method: 'DELETE' });
};

export const useApiPatch = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
) => {
    return useApiFetch<T>(url, { ...config, method: 'PATCH', data });
};
