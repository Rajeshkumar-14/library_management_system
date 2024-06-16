import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import lms_logo from '../../assests/images/logo.png';
import './headernav.css';
import AuthContext from '../../context/AuthContext';
const HeaderNav = () => {
    const { logOutUser } = useContext(AuthContext);

    return (
        <div className="headernav-container d-none d-md-block w-100">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark w-100 px-3">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={lms_logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
                        {' '}
                        LMS
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="btn btn-outline-light" onClick={logOutUser}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderNav;
