export default defineNuxtPlugin(() => {
    if (process.client) {
        // Cek apakah ada hash dengan token di URL
        if (
            window.location.hash &&
            window.location.hash.includes('access_token')
        ) {
            // Ambil parameter dari hash
            const hashParams = new URLSearchParams(
                window.location.hash.slice(1),
            );
            const queryParams = new URLSearchParams(window.location.search);

            // Pindahkan semua parameter dari hash ke query
            for (const [key, value] of hashParams.entries()) {
                queryParams.set(key, value);
            }

            // Redirect ke URL yang sama tapi dengan query string baru tanpa hash
            window.location.href =
                window.location.pathname + '?' + queryParams.toString();
        }
    }
});
