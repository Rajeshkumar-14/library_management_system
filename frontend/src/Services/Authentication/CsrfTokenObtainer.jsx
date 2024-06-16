export function getCsrfToken() {
    /**
 * Function: getCsrfToken
 * 
 * Retrieves the CSRF token value from the document's cookies.
 * 
 * @returns {string} The CSRF token value, or null if not found.
 */
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
                cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const csrftoken = getCsrfToken();