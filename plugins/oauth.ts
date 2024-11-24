export default defineNuxtPlugin(() => {
    const handleOAuthRedirect = () => {
        if (process.client) {
            const currentUrl = window.location.href;
            const hasOAuthParams =
                currentUrl.includes('access_token') ||
                currentUrl.includes('#access_token');

            if (hasOAuthParams) {
                // Store OAuth state jika diperlukan
                localStorage.setItem('oauth_redirect', 'true');
            }
        }
    };

    return {
        provide: {
            handleOAuthRedirect,
        },
    };
});
