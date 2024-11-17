import React from 'react';
import './BestRates.css';
import { MdOutlineArrowBack } from "react-icons/md";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const BestRates = () => {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div className='container-best-rates'>
            <MdOutlineArrowBack className='home-button' onClick={navigateHome} />
            <h1 className='heading-best-rates'><MdOutlineVerified /> Best Rates</h1>
        </div>
    );
}

export default BestRates;