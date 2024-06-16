import axios from 'axios';
import { csrftoken } from './CsrfTokenObtainer';  // Ensure this is correctly imported
import axiosInstance from '../../utils/axiosInstance';

// Set the base API URL
const baseURL = 'http://localhost:8000/auth/';

// Set xsrfCookieName and xsrfHeaderName
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;
console.log(csrftoken);

axios.interceptors.request.use(
    (config) => {
        config.headers["X-CSRFToken"] = csrftoken;
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to sign in a user
export const signInUserAPI = async (username, password) => {
    /**
     * Function to sign in a user by making an API request to the backend.
     * 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise} A Promise that resolves to the response data from the API.
     * @throws {Error} If there is an error during the sign-in process.
     */
    try {
        const response = await axios.post(`${baseURL}signin/`, {
            username: username,
            password: password
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

// Function to sign up a user
export const signUpUserAPI = async (username, first_name, last_name, email, password, password2) => {
    /**
     * Function to sign up a user by making an API request to the server.
     * 
     * @param {string} username - The username of the user to sign up.
     * @param {string} first_name - The first name of the user to sign up.
     * @param {string} last_name - The last name of the user to sign up.
     * @param {string} email - The email of the user to sign up.
     * @param {string} password - The password of the user to sign up.
     * @param {string} password2 - The confirmation password of the user to sign up.
     * @returns {Promise} A promise that resolves with the response data if the sign-up is successful, otherwise rejects with an error.
     */
    try {
        const response = await axios.post(`${baseURL}signup/`, {
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            password2: password2
        });
        return response;
    } catch (error) {
        console.error("Error during sign-up:", error.response.data);
        throw error;
    }
};

// Function to update the token
export const UpdateTokenAPI = async () => {
    /**
     * Function: UpdateTokenAPI
     * Description: This function is responsible for updating the authentication token by sending a POST request to the server with the refresh token stored in the local storage.
     * 
     * @returns {Promise} A promise that resolves to the response from the server after updating the token.
     * @throws {Error} If the refresh token is not found in the local storage or if there is an error during the update process.
     */
    try {
        const refresh_token = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).refresh : null;

        if (!refresh_token) {
            throw new Error("Refresh token not found in local storage.");
        }

        const response = await axios.post(`${baseURL}signin/refresh/`, {
            refresh: refresh_token
        });

        return response;
    } catch (error) {
        console.error("Error during Update Token:", error);
        throw error;
    }
};

// Function to log out a user
export const logOutUserAPI = async () => {
    /**
     * Function: logOutUserAPI
     * Description: Logs out the user by sending a POST request to the logout endpoint with the refresh token.
     * 
     * @returns {Promise} A promise that resolves with the response data if successful, or rejects with an error.
     * @throws {Error} If refresh token or access token is not found in local storage, or if an error occurs during the logout process.
     */
    try {
        const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
        const refresh_token = authTokens ? authTokens.refresh : null;
        const access_token = authTokens ? authTokens.access : null;

        if (!refresh_token || !access_token) {
            throw new Error("Refresh token or access token not found in local storage.");
        }

        const response = await axios.post(
            `${baseURL}logout/`,
            { refresh: refresh_token },
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        return response;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};

export const fetchUserAPI = async () => {
    /**
     * Function to fetch user data from the API.
     * 
     * @returns {Promise} A promise that resolves with the user data from the API.
     * @throws {Error} If there is an error fetching the user data.
     */
    try {
        const response = await axiosInstance.get(`auth/user/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const updateProfileAPI = async (username, first_name, last_name, email, id) => {
    /**
     * Function to update user profile information via API request.
     *
     * @param {string} username - The username of the user.
     * @param {string} first_name - The first name of the user.
     * @param {string} last_name - The last name of the user.
     * @param {string} email - The email of the user.
     * @param {number} id - The ID of the user whose profile is being updated.
     * @returns {Promise} A promise that resolves with the response data if the update is successful.
     * @throws {Error} An error if there is an issue during the profile update process.
     */
    try {
        const response = await axios.put(`${baseURL}update_profile/${id}/`, {
            username,
            first_name,
            last_name,
            email
        });
        return response;
    } catch (error) {
        console.error("Error during Profile Update:", error);
        throw error;
    }
};

export const updatePasswordAPI = async (old_password, new_password, confirm_password) => {
    /**
 * Function to update user password using API request.
 * 
 * @param {string} old_password - The old password of the user.
 * @param {string} new_password - The new password to be set for the user.
 * @param {string} confirm_password - The confirmation of the new password.
 * @returns {Promise} A promise that resolves with the response data if successful, or rejects with an error.
 */
    try {
        const response = await axios.put(`${baseURL}change_password/`, {
            old_password: old_password,
            new_password: new_password,
            confirm_password: confirm_password
        })
        return response;
    } catch (error) {
        console.error("Error during Password Update:", error);
        throw error;
    }
}

export const requestOTPAPI = async (email) => {
    /**
 * Function to send a request to the server to generate a one-time password (OTP) for password reset.
 * 
 * @param {string} email - The email address of the user for which the OTP is requested.
 * @returns {Promise} - A promise that resolves with the response data if the request is successful, otherwise rejects with an error.
 * @throws {Error} - If there is an error during the password reset request.
 */
    try {
        const response = await axios.post(`${baseURL}password-reset/`, {
            email
        })
        return response;
    } catch (error) {
        console.error("Error during Password Update:", error);
        throw error;
    }
}

export const resetPasswordAPI = async (email, otp, new_password1, new_password2) => {
    /**
 * Function to reset user password by sending a POST request to the specified API endpoint.
 * 
 * @param {string} email - The email of the user requesting the password reset.
 * @param {string} otp - The one-time password for verification.
 * @param {string} new_password1 - The new password to be set.
 * @param {string} new_password2 - Confirmation of the new password.
 * @returns {Promise} A promise that resolves with the response data if the request is successful, otherwise rejects with an error.
 * @throws {Error} If an error occurs during the password reset process.
 */
    try {
        const response = await axios.post(`${baseURL}password-reset-confirm/`, {
            email,
            otp,
            new_password1,
            new_password2
        });
        return response;
    } catch (error) {
        console.error("Error during Password Update:", error);
        throw error;
    }
};
