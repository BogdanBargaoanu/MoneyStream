import React from 'react';
import Navbar from './Navbar'
import './Dashboard.css'
import menu from '../Assets/main-menu.png'
import logo from '../Assets/logo.png'

const DashboardPage = () => {
    const [showNav, setShowNav] = React.useState(false);

    return (
        <div>
            <header>
                <img className="menu" src={menu} alt="" onClick={() => setShowNav(!showNav)} />
            </header>
            <img className="logo" src={logo} alt="" />
            {showNav && <Navbar />}
        </div>
    );
}

export default DashboardPage;