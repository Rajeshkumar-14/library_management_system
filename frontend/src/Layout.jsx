import React from 'react';
import NavigationBar from './components/NavBar';
import SideBar from './components/SideBar';
import HeaderNav from './components/Header';

function Layout({ children }) {
    return (
        <div className="layout w-100">
            <SideBar />
            <div className="content w-100">
                <NavigationBar />
                <HeaderNav />
                <div className="page-content mx-3 mx-lg-0 d-flex justify-content-center align-items-center">{children}</div>
            </div>
        </div>
    );
}

export default Layout;