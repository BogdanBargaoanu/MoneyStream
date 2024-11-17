import React, { useEffect, useState } from 'react';
import './NearestRates.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const NearestRates = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const latitude = queryParams.get('lat');
    const longitude = queryParams.get('lng');

    const [nearestRates, setNearestRates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchNearestRates = async () => {
        axios.get(`http://localhost:3000/rate/nearest`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                page: currentPage
            },
        })
            .then(response => {
                if (response.data.success) {
                    setNearestRates(prevRates => [...prevRates, ...response.data.result]);
                    setCurrentPage(currentPage + 1);
                }
                else {
                    console.error('Failed to fetch locations');
                }
            })
            .catch(error => {
                console.error(error);
                if (error.response.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.location.href = '/dashboard';
                }
            });
    };

    useEffect(() => {
        fetchNearestRates();
    }, []);

    return (
        <div className='container-nearest-rates'>
            <h1 className='heading-nearest-rates'>Nearest Rates</h1>
            <div className="row-group">
                <p className='space'>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
            </div>
            <div className="data-container">
            {nearestRates.length > 0 ? (
                <ul>
                    {nearestRates.map((rate, index) => (
                        <li key={index}>
                            <p>Address: {rate.address}</p>
                            <p>Currency: {rate.name}</p>
                            <p>Rate: {rate.value}</p>
                            <p>Date: {new Date(rate.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rates found.</p>
            )}
            </div>
        </div>
    );
}

export default NearestRates;