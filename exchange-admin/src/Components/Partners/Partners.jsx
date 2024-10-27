import React from 'react';
import Navbar from '../Dashboard/Navbar'
import logo from '../Assets/logo.png'
import './Partners.css'

const Partners = () => {

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
            <h1>PARTNERS</h1>
        </div>
    );
}

export default Partners;