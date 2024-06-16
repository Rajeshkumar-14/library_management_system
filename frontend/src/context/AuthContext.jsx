import { createContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { signInUserAPI, UpdateTokenAPI, logOutUserAPI, fetchUserAPI, updateProfileAPI, signUpUserAPI, updatePasswordAPI, requestOTPAPI, resetPasswordAPI } from '../Services/Authentication/API-Request';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DNALoader } from '../components/Loader';
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    /**
     * Function to provide authentication context to the application.
     * 
     * @param {Object} children - The child components to be rendered within the AuthProvider.
     * @returns {JSX.Element} - Returns the AuthContext.Provider with the context data and child components.
     **/
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
    );
    const [userLoading, setUserLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);

    const authTokensRef = useRef(authTokens);
    const navigate = useNavigate();

    const signInUser = async (evnt) => {
        setUserLoading(true);
        evnt.preventDefault();
        let username = evnt.target.username.value;
        let password = evnt.target.password.value;
        try {
            const response = await signInUserAPI(username, password);
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire("Error", "Incorrect username or password", "error");
                navigate('signin/');
            } else {
                console.error("Error during sign-in:", error);
                navigate('signin/');
            }
        } finally {
            setUserLoading(false);
        }
    };
    const signUpUser = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setUserLoading(true);
        let form = e.target; // Get the form element
        let username = form.username.value;
        let first_name = form.first_name.value;
        let last_name = form.last_name.value;
        let email = form.email.value;
        let password = form.password.value;
        let password2 = form.password2.value;
        try {
            const response = await signUpUserAPI(username, first_name, last_name, email, password, password2);
            if (response.status === 201) {
                navigate('signin/');
            } else {
                console.error("Error during registration:", response);
            }
        } catch (error) {
            // If error, handle the errors and add the 'is-invalid' class to corresponding form controls
            const { data } = error.response;
            let errorMessage = '<ul style="list-style-type: none; padding: 0; text-align:start;">';

            Object.keys(data).forEach((field) => {
                data[field].forEach((message) => {
                    errorMessage += `<li><strong>${field}:</strong> ${message}</li>`;
                });
            });

            errorMessage += '</ul>';

            console.error("Error during registration:", error);
            Swal.fire({
                title: "Error",
                html: errorMessage,
                icon: "error"
            });
        } finally {
            setUserLoading(false);
        }
    };

    const logOutUserHandler = async () => {
        try {
            const response = await logOutUserAPI();
            if (response.status === 204) {
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem('authTokens');
                navigate('signin/');
            } else {
                console.error("Error during logout:", response.data);
                localStorage.removeItem('authTokens');
                navigate('signin/');
            }
        } catch (error) {
            console.error("Error during logout:", error);
            localStorage.removeItem('authTokens');
            navigate('signin/');

        }
    };

    const updateToken = async () => {
        try {
            if (authTokensRef.current && authTokensRef.current.refresh) {
                const response = await UpdateTokenAPI(authTokensRef.current.refresh);

                if (response.status === 200) {
                    const data = response.data;
                    setAuthTokens(data);
                    setUser(jwtDecode(data.access));
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
                    authTokensRef.current = data;
                } else {
                    console.error("status:", response.status, "Error updating token:", response.data);
                    logOutUserHandler();
                }
            } else {
                console.error("Refresh token not found in local storage");
                logOutUserHandler();
            }
        } catch (error) {
            console.error("Error updating token:", error);
            Swal.fire("Error", "Error updating token:" + error, "error");
            logOutUserHandler();
        }
    };

    const fetchUserData = async () => {
        try {
            if (user) {
                const userData = await fetchUserAPI();
                setUser(userData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            logOutUserHandler();
        }
    };

    const updateProfile = async (username, first_name, last_name, email, id) => {
        try {
            const response = await updateProfileAPI(username, first_name, last_name, email, id);
            Swal.fire("Success", "Profile Updated Successfully", "success");
            await fetchUserData();
            navigate('user-profile/');
            return response;
        } catch (error) {
            Swal.fire("Error", "Error updating profile: " + error, "error");
            throw error;
        }
    };

    const updatePassword = async (evnt) => {
        setUserLoading(true);
        evnt.preventDefault();
        let old_password = evnt.target.old_password.value;
        let new_password = evnt.target.new_password.value;
        let confirm_password = evnt.target.confirm_password.value;
        console.log(old_password, new_password, confirm_password);
        try {
            const response = await updatePasswordAPI(old_password, new_password, confirm_password);
            Swal.fire("Success", "Password Updated Successfully", "success");
            navigate('user-profile/');
            return response;
        } catch (error) {
            const { data } = error.response;
            let errorMessage = '<ul style="list-style-type: none; padding: 0; text-align:start;">';

            Object.keys(data).forEach((field) => {
                data[field].forEach((message) => {
                    errorMessage += `<li><strong>${field}:</strong> ${message}</li>`;
                });
            });

            errorMessage += '</ul>';

            console.error("Error during registration:", error);
            Swal.fire({
                title: "Error",
                html: errorMessage,
                icon: "error"
            });
            throw error;
        } finally {
            setUserLoading(false);
        }

    }

    const requestOTP = async (evnt) => {
        setUserLoading(true);
        evnt.preventDefault();
        let email = evnt.target.email.value;
        try {
            const response = await requestOTPAPI(email);
            if (response.status === 200) {
                Swal.fire("Success", "OTP sent successfully", "success");
                navigate('/reset-password')
            }
        } catch (error) {
            const { data } = error.response;
            let errorMessage = '<ul style="list-style-type: none; padding: 0; text-align:start;">';

            Object.keys(data).forEach((field) => {
                data[field].forEach((message) => {
                    errorMessage += `<li><strong>${field}:</strong> ${message}</li>`;
                });
            });

            errorMessage += '</ul>';

            console.error("Error Requesting OTP:", error);
            Swal.fire({
                title: "Error",
                html: errorMessage,
                icon: "error"
            });
            throw error;
        } finally {
            setUserLoading(false);
        }
    }
    const resetPassword = async (event, otpString) => {
        setUserLoading(true);
        event.preventDefault();
        const email = event.target.email.value;
        const new_password1 = event.target.new_password.value;
        const new_password2 = event.target.confirm_password.value;
        console.log(email, new_password1, new_password2, otpString);

        try {
            const response = await resetPasswordAPI(email, otpString, new_password1, new_password2);
            if (response.status === 200) {
                Swal.fire("Success", "Password reset successful. Try Logging In with your New Password", "success");
                navigate('/signin')
            }
        } catch (error) {
            const { data } = error.response;
            let errorMessage = '<ul style="list-style-type: none; padding: 0; text-align:start;">';
            Object.keys(data).forEach((field) => {
                data[field].forEach((message) => {
                    errorMessage += `<li><strong>${field}:</strong> ${message}</li>`;
                });
            });
            errorMessage += '</ul>';
            console.error("Error Requesting OTP:", error);
            Swal.fire({
                title: "Error",
                html: errorMessage,
                icon: "error"
            });
            throw error;
        } finally {
            setUserLoading(false);
        }
    };


    useEffect(() => {
        if (authTokens) {
            updateToken().finally(() => setPageLoading(false));
        } else {
            setPageLoading(false);
        }

        let fourMinutes = 1000 * 60 * 4;
        let interval = setInterval(() => {
            if (authTokensRef.current) {
                updateToken();
            }
        }, fourMinutes);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        authTokensRef.current = authTokens;
    }, [authTokens]);

    useEffect(() => {
        if (!authTokens) {
            setUserLoading(false);
        }
    }, [authTokens, navigate]);

    useEffect(() => {
        if (!user || !user.email) {
            fetchUserData().finally(() => setUserLoading(false));
        }
    }, [user]);

    const contextData = {
        // Authentication
        signInUser,
        signUpUser,
        logOutUser: logOutUserHandler,
        updateProfile,
        updatePassword,
        requestOTP,
        resetPassword,
        user,
        authTokens,
        userLoading,
        pageLoading,
        setUserLoading,
        setPageLoading,
        setUser,
        fetchUserData,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {pageLoading || userLoading ? <DNALoader /> : children}
        </AuthContext.Provider>
    );

};
