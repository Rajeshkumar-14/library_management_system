import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../components/Loader/DNALoader';
import AuthContext from './AuthContext';
import {
    createBookAPI, updateBookAPI, deleteBookAPI,
    createCategoryAPI, updateCategoryAPI, deleteCategoryAPI,
    createMemberAPI, updateMemberAPI, deleteMemberAPI,
    createManagementAPI,
    updateManagementAPI,
    deleteManagementAPI,
} from '../Services/LMS/API-Request';
const ManagementContext = createContext();

export default ManagementContext;


export const ManagementProvider = ({ children }) => {
    /**
     * ManagementProvider function to provide CRUD operations for Books, Categories, Members, and Management data.
     * 
     * @param {Object} children - The children components to be rendered within the ManagementProvider.
     * @returns {JSX.Element} JSX element containing the ManagementContext.Provider with CRUD functions and Loader component.
     */
    const { user, pageLoading } = useContext(AuthContext)

    // Books
    const createBook = async (data) => {
        try {
            const response = await createBookAPI(data);
            return response;
        } catch (error) {
            console.error("Error creating Book data:", error);
            throw error;
        }
    }

    const updateBook = async (bookId, data) => {
        try {
            const response = await updateBookAPI(bookId, data);
            return response;
        } catch (error) {
            console.error("Error updating Book data:", error);
            throw error;
        }
    }

    const deleteBook = async (bookId) => {
        try {
            const response = await deleteBookAPI(bookId);

            return response;
        } catch (error) {
            console.error("Error deleting Book data:", error);
            throw error;
        }
    }

    // Category
    const createCategory = async (data) => {
        try {
            const response = await createCategoryAPI(data);
            return response;
        } catch (error) {
            console.error("Error creating Book data:", error);
            throw error;
        }
    }

    const updateCategory = async (bookId, data) => {
        try {
            const response = await updateCategoryAPI(bookId, data);
            return response;
        } catch (error) {
            console.error("Error updating Book data:", error);
            throw error;
        }
    }

    const deleteCategory = async (bookId) => {
        try {
            const response = await deleteCategoryAPI(bookId);
            return response;
        } catch (error) {
            console.error("Error deleting Book data:", error);
            throw error;
        }
    }

    // Members
    const createMember = async (data) => {
        try {
            const response = await createMemberAPI(data);
            return response;
        } catch (error) {
            console.error("Error creating Member data:", error);
            throw error;
        }
    }

    const updateMember = async (memberID, data) => {
        try {
            const response = await updateMemberAPI(memberID, data);
            return response;
        } catch (error) {
            console.error("Error creating Member data:", error);
            throw error;
        }
    }

    const deleteMember = async (memberID) => {
        try {
            const response = await deleteMemberAPI(memberID);
            return response;
        } catch (error) {
            console.error("Error deleting Member data:", error);
            throw error;
        }
    }
    // Management Section
    const createManagement = async (data) => {
        try {
            const response = await createManagementAPI(data);
            return response;
        } catch (error) {
            console.error("Error creating Management data:", error);
            throw error;
        }
    }

    const updateManagement = async (managementID, data) => {
        try {
            const response = await updateManagementAPI(managementID, data);
            return response;
        } catch (error) {
            console.error("Error creating Management data:", error);
            throw error;
        }
    }

    const deleteManagement = async (managementID) => {
        try {
            const response = await deleteManagementAPI(managementID);
            return response;
        } catch (error) {
            console.error("Error deleting Management data:", error);
            throw error;
        }
    }
    const contextData = {
        // Books
        createBook,
        updateBook,
        deleteBook,

        // Category
        createCategory,
        updateCategory,
        deleteCategory,

        // Members
        createMember,
        updateMember,
        deleteMember,

        // Management
        createManagement,
        updateManagement,
        deleteManagement,
    }

    return (
        <ManagementContext.Provider value={contextData}>
            {pageLoading ? <Loader /> : children}
        </ManagementContext.Provider>
    )
}