import React from 'react';
import './Home.css';
import logo from '../Assets/logo.png';
import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineVerified } from "react-icons/md";
import { ImLocation } from "react-icons/im";


const Home = () => {
    return (
        <div className='container-main'>
            <img className='logo' src={logo} alt='logo' />
            <h1 className='heading-main'>Exchange Monitor</h1>
            <button className='btn-main'><ImLocation /> Nearest rates</button>
            <button className='btn-main'><MdOutlineVerified /> Best rates</button>
            <button className='btn-main'><PiListBulletsBold /> All rates</button>
        </div>
    );
}

export default Home;