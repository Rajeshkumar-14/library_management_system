// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ManagementProvider } from './context/ManagementContext';
import './App.css';
import './Custom-style.css';

// Private Route
import PrivateRoute from './utils/PrivateRoute';
// Layout 
import Layout from './Layout';
// Authentication Pages
import SignInPage from './pages/Authentication/SignInPage';
import SignUpPage from './pages/Authentication/SignUpPage';
import OTPRequestPage from './pages/Authentication/OTPRequestPage';
import ResetPasswordPage from './pages/Authentication/ResetPasswordPage';
// User Profile/Management Pages
import UserProfilePage from './pages/Authentication/UserProfilePage';
import EditUserProfilePage from './pages/Authentication/EditUserProfilePage';
import UpdatePasswordPage from './pages/Authentication/UpdatePasswordPage';
// Management Pages
import HomePage from './pages/LMS/HomePage';
import BookPage from './pages/LMS/BookPage';
import CategoryPage from './pages/LMS/CategoryPage';
import MemberPage from './pages/LMS/MemberPage';

// Management Pages
import IssuePage from './pages/LMS/IssuePage';
import HistoryPage from './pages/LMS/HistoryPage';
function App() {
  return (
    <div className="App w-100">
      <BrowserRouter>
        <AuthProvider>
          <ManagementProvider>
            <Routes>
              {/* Authentication */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<OTPRequestPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              {/* Pages with layout */}
              <Route element={<PrivateRoute />}>
                {/* Library Management Pages */}
                {/* HomePage */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                {/* BookPage */}
                <Route path="/books" element={<Layout><BookPage /></Layout>} />
                <Route path="/category" element={<Layout><CategoryPage /></Layout>} />
                <Route path="/members" element={<Layout><MemberPage /></Layout>} />
                {/* Transaction Pages */}
                <Route path="/records" element={<Layout><IssuePage /></Layout>} />
                {/* History Page */}
                <Route path='/history' element={<Layout><HistoryPage /></Layout>} />
                {/* User Profile Pages */}
                <Route path="/user-profile" element={<Layout><UserProfilePage /></Layout>} />
                <Route path="/edit-user-profile" element={<Layout><EditUserProfilePage /></Layout>} />
                <Route path="/update-password" element={<Layout><UpdatePasswordPage /></Layout>} />
              </Route>
            </Routes>
          </ManagementProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
