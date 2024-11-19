import React, { useEffect, useState } from 'react';
import './AllRates.css';
import { MdOutlineArrowBack } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllRates = () => {
    const [allRates, setAllRates] = useState([]);
    const [groupedRates, setGroupedRates] = useState([]);
    const navigate = useNavigate();

    const fetchAllRates = () => {
        console.log('fetching nearest rates');
        axios.get(`http://localhost:3000/rate/allRates`)
            .then(response => {
                if (response.data.success) {
                    setAllRates(response.data.result);
                }
                else {
                    console.error('Failed to fetch rates');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchAllRates();
    }, []);

    useEffect(() => {
        // Group the rates by address
        const groupByAddress = (rates) => {
            return rates.reduce((acc, rate) => {
                if (!acc[rate.address]) {
                    acc[rate.address] = [];
                }
                acc[rate.address].push(rate);
                return acc;
            }, {});
        };

        setGroupedRates(groupByAddress(allRates));
    }, [allRates]);

    const generateMapUrlFromAddress = (address) => {
        if (address) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=16&maptype=roadmap`;
        }
        return '';
    };

    const generateMapUrlFromLatLong = (latitude, longitude) => {
        if (latitude && longitude) {
            return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
        }
        return '';
    };

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div className='container-all-rates'>
            <MdOutlineArrowBack className='home-button' onClick={navigateHome} />
            <h1 className='heading-all-rates'><PiListBulletsBold /> All Rates</h1>
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
        </div>
    );
}

export default AllRates;