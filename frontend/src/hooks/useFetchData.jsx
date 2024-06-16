import { useEffect, useState } from 'react';
import { fetchInitialCountsAPI, fetchBookCountsAPI, fetchBooksAPI, fetchCategoryAPI, fetchGenderChoicesAPI, fetchMemberCountsAPI, fetchMembersAPI, fetchPlanChoicesAPI, fetchInsightsAPI, fetchManagementAPI } from '../Services/LMS/API-Request';



const useFetchData = (pageLoading) => {
    /**
     * Custom hook to fetch data for the dashboard, books, categories, members, and management sections.
     * This hook fetches various data from different API endpoints and updates the state accordingly.
     * It also handles error states in case of failed API requests.
     * 
     * @param {boolean} pageLoading - Flag to indicate if the page is loading
     * @returns {Object} An object containing functions to fetch data for different sections, as well as the state variables for the fetched data and errors
     */
    // DashBoard
    const [dashboardData, setDashboardData] = useState([]);
    const [bookDashboardData, setBookDashboardData] = useState([]);
    const [memberDashboardData, setMemberDashboardData] = useState([]);
    // Books
    const [books, setBooks] = useState([]);
    // Category
    const [categorys, setCategorys] = useState([]);
    // Members
    const [members, setMembers] = useState([]);
    const [genderChoices, setGenderChoices] = useState([]);
    const [planChoices, setPlanChoices] = useState([]);
    // Management
    const [management, setManagement] = useState([]);
    const [error, setError] = useState(null);

    const [inSiteData, setInSightData] = useState({
        topBooksWeek: [],
        topBooksMonth: [],
        topBooksAllTime: [],
    });

    // fetch Dashboard data for home
    const fetchInitialCounts = async () => {
        try {
            const response = await fetchInitialCountsAPI();
            const { issued_books_count, returned_books_count, total_books_count, total_members_count } = response.data;
            setDashboardData([
                { bgClass: 'bg-info', img_name: "issued_icon", total: issued_books_count, text: 'Issued Books' },
                { bgClass: 'bg-success', img_name: "returned_icon", total: returned_books_count, text: 'Returned Books' },
                { bgClass: 'bg-warning', img_name: 'book_icon', total: total_books_count, text: 'Total Books' },
                { bgClass: 'bg-danger', img_name: 'members_icon', total: total_members_count, text: 'Total Members' },
            ]);
        } catch (error) {
            setError('Failed to fetch Home Dashboard data: ' + error.message);
        }
    }

    const fetchInsightData = async () => {
        try {
            const response = await fetchInsightsAPI();

            // Destructuring and formatting the response data
            const { topBooksWeek, topBooksMonth, topBooksAllTime } = response.data;
            // Setting the state with the extracted data
            setInSightData({
                topBooksWeek: topBooksWeek.map(item => ({
                    bookName: item.book__name,
                    numBorrowed: item.num_borrowed
                })),
                topBooksMonth: topBooksMonth.map(item => ({
                    bookName: item.book__name,
                    numBorrowed: item.num_borrowed
                })),
                topBooksAllTime: topBooksAllTime.map(item => ({
                    bookName: item.book__name,
                    numBorrowed: item.num_borrowed
                })),
            });
        } catch (error) {
            console.error('Error fetching Insight data', error);
        }
    };

    // Fetch dashboard data for Books
    const fetchBookData = async () => {
        try {
            const response = await fetchBookCountsAPI();
            const { issued_books_count, returned_books_count, total_books_count, not_returned_books_count } = response.data;

            setBookDashboardData([
                { bgClass: 'bg-warning', img_name: "book_icon", total: total_books_count, text: 'Total' },
                { bgClass: 'bg-info', img_name: "issued_icon", total: issued_books_count, text: 'Issued' },
                { bgClass: 'bg-success', img_name: "returned_icon", total: returned_books_count, text: 'Returned' },
                { bgClass: 'bg-danger', img_name: "not_returned_icon", total: not_returned_books_count, text: 'Not Returned' },
            ]);
        } catch (error) {
            setError('Failed to fetch Book data for Dashboard: ' + error.message);
        }
    };


    const fetchBook = async () => {
        try {
            const response = await fetchBooksAPI();
            const data = response.data;
            setBooks(data.results);
        } catch (error) {
            setError('Failed to fetch book data: ' + error.message);
        }
    };

    // Category Section
    const fetchCategory = async () => {
        try {
            const response = await fetchCategoryAPI();
            const data = response.data;
            setCategorys(data.results);
        } catch (error) {
            setError('Failed to fetch category data: ' + error.message);
        }
    };
    // Member Section
    const fetchMemberData = async () => {

        try {
            const response = await fetchMemberCountsAPI();
            const { normal_member_count, premium_member_count, total_member_count, student_member_count } = response.data;

            setMemberDashboardData([
                { bgClass: 'bg-warning', img_name: "members_icon", total: total_member_count, text: 'Total' },
                { bgClass: 'bg-info', img_name: "normal_user_icon", total: normal_member_count, text: 'Normal' },
                { bgClass: 'bg-success', img_name: "premium_user_icon", total: premium_member_count, text: 'Premium' },
                { bgClass: 'bg-danger', img_name: "student_icon", total: student_member_count, text: 'Students' },
            ]);
        } catch (error) {
            setError('Failed to fetch Dashboard Member data: ' + error.message);
        }
    };
    const fetchMember = async () => {
        try {
            const response = await fetchMembersAPI();
            const data = response.data;
            setMembers(data.results);
        } catch (error) {
            setError('Failed to fetch member data: ' + error.message);
        }
    };

    const fetchGenderChoices = async () => {
        try {
            const response = await fetchGenderChoicesAPI();
            const data = response.data;
            setGenderChoices(data);
        } catch (error) {
            setError('Failed to fetch gender choices: ' + error.message);
        }
    }

    const fetchPlanChoices = async () => {
        try {
            const response = await fetchPlanChoicesAPI();
            const data = response.data;
            setPlanChoices(data);
        } catch (error) {
            setError('Failed to fetch plan choices: ' + error.message);
        }
    }

    // Management (Issued, Returned, Not Returned) Section
    const fetchManagement = async () => {

        try {
            const response = await fetchManagementAPI();
            const data = response.data.results;
            console.log(data);
            setManagement(data);
        } catch (error) {
            console.error("Error fetching Management data:", error);
        }
    }

    useEffect(() => {
        if (!pageLoading) {
            // Fetch Home Data
            fetchInitialCounts();
            fetchInsightData();
            // Fetch Book
            fetchBookData();
            fetchBook();
            // Fetch Category
            fetchCategory();
            // Fetch Member
            fetchMemberData();
            fetchMember();
            fetchGenderChoices();
            fetchPlanChoices();
            // Fetch Management
            fetchManagement();
            const interval = setInterval(() => {
                // Fetch Home Data
                fetchInitialCounts();
                fetchInsightData();
                // Fetch Book
                fetchBookData();
                fetchBook();
                // Fetch Category
                fetchCategory();
                // Fetch Member
                fetchMemberData();
                fetchMember();
                fetchGenderChoices();
                fetchPlanChoices();
                // Fetch Management
                fetchManagement();
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [pageLoading]);

    return { fetchBookData, fetchCategory, fetchBook, fetchMember, fetchMemberData, fetchGenderChoices, fetchPlanChoices, fetchManagement, planChoices, inSiteData, genderChoices, dashboardData, memberDashboardData, bookDashboardData, books, categorys, members, management, error };
};

export default useFetchData;
