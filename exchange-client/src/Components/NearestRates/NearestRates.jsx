import React, { useEffect, useState, useCallback } from 'react';
import './NearestRates.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack } from "react-icons/md";
import { ImLocation } from "react-icons/im";

const NearestRates = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const latitude = queryParams.get('lat');
    const longitude = queryParams.get('lng');

    const [nearestRates, setNearestRates] = useState([]);
    const [groupedRates, setGroupedRates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchNearestRates = useCallback((latitude, longitude, page) => {
        console.log('fetching nearest rates');
        axios.get(`http://localhost:3000/rate/nearest`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                page: page
            },
        })
            .then(response => {
                if (response.data.success) {
                    setNearestRates(prevRates => [...prevRates, ...response.data.result]);
                }
                else {
                    console.error('Failed to fetch locations');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        fetchNearestRates(latitude, longitude, currentPage); // Double fetch due to the React.StrictMode warning
    }, [latitude, longitude, currentPage, fetchNearestRates]);

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

        setGroupedRates(groupByAddress(nearestRates));
    }, [nearestRates]);

    const loadNewData = () => {
        setCurrentPage(currentPage + 1);
    };

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
        <div className='container-nearest-rates'>
            <MdOutlineArrowBack className='home-button' onClick={navigateHome} />
            <h1 className='heading-nearest-rates'><ImLocation /> Nearest Rates</h1>
            <div className='row-group'>
                <p className='space'>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
            </div>
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

export default NearestRates;