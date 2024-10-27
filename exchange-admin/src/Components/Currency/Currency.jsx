import React from 'react';
import Navbar from '../Dashboard/Navbar'
import logo from '../Assets/logo.png'
import './Currency.css'

const Currency = () => {

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
            <h1>CURRENCY</h1>
        </div>
    );
}

export default Currency;