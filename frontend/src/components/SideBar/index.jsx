import React, { useState, useRef, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const SideBar = () => {
    const { user, fetchUserData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isSidebarClosed, setIsSidebarClosed] = useState(true);
    const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => {
            const newState = !prevState;
            if (newState) {
                setIsProfileDropdownOpen(false);
                setIsManagementDropdownOpen(false);
            }
            return newState;
        });
    };


    const toggleDropdown = (dropdown) => {
        if (isSidebarClosed) {
            setIsSidebarClosed(false);
            setTimeout(() => {
                if (dropdown === 'management') {
                    setIsManagementDropdownOpen(true);
                } else {
                    setIsProfileDropdownOpen(true);
                }
            }, 200);
        } else {
            if (dropdown === 'management') {
                setIsManagementDropdownOpen(prevState => !prevState);
            } else {
                setIsProfileDropdownOpen(prevState => !prevState);
            }
        }
    };

    const handleUpdateProfile = async () => {
        await fetchUserData();
        toggleSidebar();
        navigate('/user-profile');
    };

    return (
        <nav className={`sidebar ${isSidebarClosed ? "close" : ""} d-none d-md-block`}>
            <header>
                <h5 className="logo-text text-light">LMS</h5>
                <div className="logo-sub-container text-light">
                    <span className="logo-sub-text">Library</span>
                    <span className="logo-sub-text">Management</span>
                    <span className="logo-sub-text">System</span>
                </div>
                <i className="bi bi-list-nested toggle" onClick={toggleSidebar}></i>
            </header>

            <ul className="menu">
                <li className="nav-link">
                    <Link className="item text-decoration-none" to="/" onClick={() => !isSidebarClosed && toggleSidebar()}>
                        <i className="bi bi-house-door-fill icon"></i>
                        <span className="text">Home</span>
                    </Link>
                </li>

                <li className="nav-link">
                    <a className="item managementDropdown" onClick={() => toggleDropdown('management')} href="#managementsDropdown" role="button" aria-expanded="false" aria-controls="managementsDropdown">
                        <i className="bi bi-database-gear icon"></i>
                        <span className="text">Resources</span>
                    </a>
                </li>
                <div className={`collapse ${isManagementDropdownOpen ? 'show' : ''}`} id="managementsDropdown">
                    <ul className="submenu">
                        <li className="nav-link">
                            <Link to="/category" className="item" onClick={toggleSidebar}>
                                <i className="bi bi-collection icon"></i>
                                <span className="text">Category</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/books" className="item" onClick={toggleSidebar}>
                                <i className="bi bi-book icon"></i>
                                <span className="text">Book</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/members" className="item" onClick={toggleSidebar}>
                                <i className="bi bi-people-fill icon"></i>
                                <span className="text">Members</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <li className="nav-link">
                    <Link className="item" to='/records' onClick={() => !isSidebarClosed && toggleSidebar()}>
                        <i className="bi bi-arrow-left-right icon"></i>
                        <span className="text">Transaction</span>
                    </Link>
                </li>

                <li className="nav-link">
                    <Link className="item text-decoration-none" to="/history" onClick={() => !isSidebarClosed && toggleSidebar()}>
                        <i className="bi bi-activity icon"></i>
                        <span className="text">History</span>
                    </Link>
                </li>

                <li className="nav-link">
                    <a className="item profileDropdown" onClick={() => toggleDropdown('profile')} href="#profileDropdown" role="button" aria-expanded="false" aria-controls="profileDropdown">
                        <i className="bi bi-person icon"></i>
                        <span className="text">{user && user.username}</span>
                    </a>
                </li>
                <div className={`collapse ${isProfileDropdownOpen ? 'show' : ''}`} id="profileDropdown">
                    <ul className="submenu">
                        <li className="nav-link">
                            <button className="item btn" onClick={handleUpdateProfile}>
                                <i className="bi bi-person-gear icon"></i>
                                <span className="text">Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </ul>
        </nav>
    );
};

export default SideBar;
