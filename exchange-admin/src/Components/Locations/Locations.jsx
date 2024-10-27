import React from 'react';
import Navbar from '../Dashboard/Navbar'
import logo from '../Assets/logo.png'
import './Locations.css'

const Locations = () => {

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
            <h1>LOCATIONS</h1>
        </div>
    );
}

export default Locations;