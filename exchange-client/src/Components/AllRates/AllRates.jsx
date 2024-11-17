import React from 'react';
import './AllRates.css';
import { MdOutlineArrowBack } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const AllRates = () => {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div className='container-all-rates'>
            <MdOutlineArrowBack className='home-button' onClick={navigateHome} />
            <h1 className='heading-all-rates'><PiListBulletsBold /> All Rates</h1>
        </div>
    );
}

export default AllRates;