import React, { useState, useRef, useContext } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css';
import AuthContext from '../../context/AuthContext';

const NavigationBar = () => {
    const { user, fetchUserData, logOutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);



    const toggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
    };

    const toggleDropdown = (dropdown) => {
        if (!showOffcanvas) {
            setShowOffcanvas(true);
            if (dropdown === 'isProfileDropdownOpen') {
                setIsProfileDropdownOpen(true);
            } else if (dropdown === 'isManagementDropdownOpen') {
                setIsManagementDropdownOpen(true);
            }
        } else {
            if (dropdown === 'isProfileDropdownOpen') {
                setIsProfileDropdownOpen((prev) => !prev);
            } else if (dropdown === 'isManagementDropdownOpen') {
                setIsManagementDropdownOpen((prev) => !prev);
            }
        }
    };
    const handleUpdateProfile = async () => {
        await fetchUserData();
        toggleOffcanvas();
        navigate('/user-profile');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="md" className="mb-3 d-md-none navbar-container w-100 px-3">
            <Navbar.Brand href="/">LMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={toggleOffcanvas} />
            <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="start"
                show={showOffcanvas}
                onHide={toggleOffcanvas}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">LMS</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='bg-dark'>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <ul className="menu list-unstyled">
                            <li className="nav-link mb-2">
                                <Link className="item w-100" to="/" onClick={toggleOffcanvas}>
                                    <i className="bi bi-house-door-fill icon"></i>
                                    <span className="text">Home</span>
                                </Link>
                            </li>

                            <li className="nav-link">
                                <a className="item w-100 managementDropdown" onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('isManagementDropdownOpen');
                                }} href="#managementsDropdown" role="button" aria-expanded="false" aria-controls="managementsDropdown">
                                    <i className="bi bi-database-gear icon"></i>
                                    <span className="text">Resources</span>
                                </a>
                            </li>
                            <div className={`collapse ${isManagementDropdownOpen ? 'show' : ''}`} id="managementsDropdown">
                                <ul className="submenu">
                                    <li className="nav-link">
                                        <Link to="/category" className="item w-100" onClick={toggleOffcanvas}>
                                            <i className="bi bi-collection icon"></i>
                                            <span className="text">Category</span>
                                        </Link>
                                    </li>
                                    <li className="nav-link">
                                        <Link to="/books" className="item w-100" onClick={toggleOffcanvas}>
                                            <i className="bi bi-book icon"></i>
                                            <span className="text">Book</span>
                                        </Link>
                                    </li>
                                    <li className="nav-link">
                                        <Link to="/members" className="item w-100" onClick={toggleOffcanvas}>
                                            <i className="bi bi-people-fill icon"></i>
                                            <span className="text">Members</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <li className="nav-link">
                                <Link className="item w-100" to='/records' onClick={toggleOffcanvas}> 
                                    <i className="bi bi-arrow-left-right icon"></i>
                                    <span className="text">Transactions</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link className="item w-100" to="/history" onClick={toggleOffcanvas}>
                                    <i className="bi bi-activity icon"></i>
                                    <span className="text">History</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <a className="item w-100 profileDropdown" onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('isProfileDropdownOpen');
                                }} href="#ProfileDropdown" role="button" aria-expanded="false" aria-controls="ProfileDropdown">
                                    <i className="bi bi-person icon"></i>
                                    <span className="text">{user && user.username}</span>
                                </a>
                            </li>

                            <div className={`collapse ${isProfileDropdownOpen ? 'show' : ''}`} id="ProfileDropdown">
                                <ul className="submenu">
                                    <li className="nav-link">
                                        <a href="#" className="item w-100" onClick={handleUpdateProfile}>
                                            <i className="bi bi-person-gear icon"></i>
                                            <span className="text">Settings</span>
                                        </a>
                                    </li>
                                    <li className="nav-link">
                                        <a className="item w-100" href="#" onClick={logOutUser}>
                                            <i className="bi bi-box-arrow-right icon"></i>
                                            <span className="text">Logout</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Navbar>
    );
}

export default NavigationBar;
