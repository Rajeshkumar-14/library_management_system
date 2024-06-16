import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

// Function to fetch counts
export const fetchInitialCountsAPI = async () => {
    /**
 * Function to fetch initial counts data from the API.
 * 
 * @returns {Promise} A promise that resolves with the response data from the API.
 * @throws {Error} If there is an error fetching the initial counts data.
 */
    try {
        const response = await axiosInstance.get('api/manage/initial_counts/');
        return response;
    } catch (error) {
        console.error("Error fetching Initial count data:", error);
        throw error;
    }
};
// Function to get Insights
export const fetchInsightsAPI = async () => {
    /**
 * Function: fetchInsightsAPI
 * Description: This function makes an asynchronous GET request to fetch insights data from the API.
 * 
 * @returns {Promise} A Promise that resolves with the response data if the request is successful, otherwise rejects with an error.
 */
    try {
        const response = await axiosInstance.get('api/manage/insight/');
        return response;
    } catch (error) {
        console.error("Error fetching Insights data:", error);
        throw error;
    }
};

export const fetchBookCountsAPI = async () => {
    /**
 * Function: fetchBookCountsAPI
 * Description: This function makes an asynchronous GET request to fetch book counts data from the API.
 * 
 * @returns {Promise} A Promise that resolves with the response data from the API.
 * @throws {Error} If there is an error fetching the book counts data, an error is logged and rethrown.
 */
    try {
        const response = await axiosInstance.get('api/manage/book_counts/');
        return response;
    } catch (error) {
        console.error("Error fetching Book count data:", error);
        throw error;
    }
}

export const fetchBooksAPI = async () => {
    /**
 * Function to fetch a list of books from the API.
 * 
 * @returns {Promise} A promise that resolves with the response data from the API.
 * @throws {Error} If there is an error fetching the book data from the API.
 */
    try {
        const response = await axiosInstance.get('api/books/');
        return response;
    } catch (error) {
        console.error("Error fetching Book data:", error);
        throw error;
    }
}


// Book Section
export const createBookAPI = async (data) => {
    /**
 * Function to create a new book by making a POST request to the 'api/books/' endpoint.
 * 
 * @param {Object} data - The data of the book to be created.
 * @returns {Promise} A promise that resolves to the response data upon successful creation.
 * @throws {Error} If there is an error creating the book, it is logged and rethrown.
 */
    try {
        const response = await axiosInstance.post('api/books/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error("Error creating Book data:", error);
        throw error;
    }
}

export const updateBookAPI = async (bookId, data) => {
    /**
 * Function: updateBookAPI
 * Description: Updates a book's data by making a PUT request to the API endpoint.
 * 
 * @param {string} bookId - The ID of the book to be updated.
 * @param {object} data - The data to be updated for the book.
 * @returns {Promise} - A Promise that resolves to the response data from the API.
 * @throws {Error} - If an error occurs while updating the book data.
 */

    try {
        const response = await axiosInstance.put(
            `api/books/${bookId}/`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response;
    } catch (error) {
        console.error("Error updating Book data:", error);
        throw error;
    }
}

export const deleteBookAPI = async (bookId) => {
    /**
 * Function to delete a book by its ID using an API call.
 * 
 * @param {string} bookId - The ID of the book to be deleted.
 * @returns {Promise} - A Promise that resolves with the response data if successful, or rejects with an error.
 * @throws {Error} - If there is an error deleting the book data.
 */
    try {
        const response = await axiosInstance.delete(`api/books/${bookId}/`);
        return response;
    } catch (error) {
        console.error("Error deleting Book data:", error);
        throw error;
    }
}


// Category Section
export const fetchCategoryAPI = async () => {
    try {
        const response = await axiosInstance.get('api/categories/');
        return response;
    } catch (error) {
        console.error("Error fetching Category data:", error);
        throw error;
    }
}

export const createCategoryAPI = async (data) => {
    try {
        const response = await axiosInstance.post('api/categories/', data);
        return response;
    } catch (error) {
        console.error("Error creating Category data:", error);
        throw error;
    }
}
export const updateCategoryAPI = async (categoryID, data) => {
    try {
        const response = await axiosInstance.put(`api/categories/${categoryID}/`,data);
        return response;
    } catch (error) {
        console.error("Error creating Category data:", error);
        throw error;
    }
}
export const deleteCategoryAPI = async (categoryID) => {
    try {
        const response = await axiosInstance.delete(`api/categories/${categoryID}/`);
        return response;
    } catch (error) {
        console.error("Error creating Category data:", error);
        throw error;
    }
}

// Member Section
export const fetchMemberCountsAPI = async () => {
    try {
        const response = await axiosInstance.get('api/manage/member_counts/');
        return response;
    } catch (error) {
        console.error("Error fetching Member count data:", error);
        throw error;
    }
}

export const fetchMembersAPI = async () => {
    try {
        const response = await axiosInstance.get('api/members/');
        return response;
    } catch (error) {
        console.error("Error fetching Member data:", error);
        throw error;
    }
}

export const fetchGenderChoicesAPI = async () => {
    try {
        const response = await axiosInstance.get('api/members/gender_choices/');
        return response;
    } catch (error) {
        console.error("Error fetching Member data:", error);
        throw error;
    }
}

export const fetchPlanChoicesAPI = async () => {
    try {
        const response = await axiosInstance.get('api/members/plan_choices/');
        return response;
    } catch (error) {
        console.error("Error fetching Member data:", error);
        throw error;
    }
}

export const createMemberAPI = async (data) => {
    try {
        const response = await axiosInstance.post('api/members/', data);
        return response;
    } catch (error) {
        console.error("Error creating Member data:", error);
        throw error;
    }
}
export const updateMemberAPI = async (memberID, data) => {
    try {
        const response = await axiosInstance.put(`api/members/${memberID}/`,data);
        return response;
    } catch (error) {
        console.error("Error creating Member data:", error);
        throw error;
    }
}

export const deleteMemberAPI = async (memberID) => {
    try {
        const response = await axiosInstance.delete(`api/members/${memberID}/`);
        return response;
    } catch (error) {
        console.error("Error creating Member data:", error);
        throw error;
    }
}

// Management (Issued, Returned, Not Returned) Section
export const fetchManagementAPI = async () => {
    try {
        const response = await axiosInstance.get('api/manage/');
        return response;
    } catch (error) {
        console.error("Error fetching Management data:", error);
        throw error;
    }
}

export const createManagementAPI = async (data) => {
    try {
        const response = await axiosInstance.post('api/manage/', data);
        return response;
    } catch (error) {
        console.error("Error creating Management data:", error);
        throw error;
    }
}

export const updateManagementAPI = async (managementID, data) => {
    try {
        const response = await axiosInstance.put(`api/manage/${managementID}/`,data);
        return response;
    } catch (error) {
        console.error("Error creating Management data:", error);
        throw error;
    }
}

export const deleteManagementAPI = async (managementID) => {
    try {
        const response = await axiosInstance.delete(`api/manage/${managementID}/`);
        return response;
    } catch (error) {
        console.error("Error creating Management data:", error);
        throw error;
    }
}