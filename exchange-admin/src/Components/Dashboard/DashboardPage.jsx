import React from 'react';
import Navbar from './Navbar'
import menu from '../Assets/main-menu.png'
import './Dashboard.css'
import logo from '../Assets/logo.png'

const DashboardPage = () => {

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
        </div>
    );
}

export default DashboardPage;