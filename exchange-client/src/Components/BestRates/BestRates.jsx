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
            <div className='data-container'>
                {Object.keys(groupedRates).length > 0 ? (
                    <ul>
                        {Object.entries(groupedRates).map(([address, rates], index) => (
                            <div className='container-rate' key={index}>
                                <h3>Address: {address}</h3>
                                <iframe
                                    width="80%"
                                    height="300px"
                                    loading="lazy"
                                    allowFullScreen
                                    src={generateMapUrlFromAddress(address)}
                                ></iframe>
                                <ul>
                                    {rates.map((rate, idx) => (
                                        <li key={idx}>
                                            <p>Currency: {rate.name}</p>
                                            <p>Rate: {rate.value}</p>
                                            <p>Date: {new Date(rate.date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No rates found.</p>
                )}
            </div>
            <button className='load-more' onClick={loadNewData}>Load More</button>
        </div>
    );
}

export default BestRates;