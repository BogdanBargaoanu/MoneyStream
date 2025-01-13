import React, { useEffect, useState, useCallback } from 'react';
import './BestRates.css';
import { MdOutlineArrowBack } from "react-icons/md";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const BestRates = () => {
    const [nearestRates, setNearestRates] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchBestRates = useCallback((page, currencyId) => {
        console.log('fetching best rates');
        axios.get(`http://localhost:3000/rate/best`, {
            params: {
                page: page,
                currencyId: currencyId
            },
        })
            .then(response => {
                if (response.data.success) {
                    setNearestRates(prevRates => [...prevRates, ...response.data.result]);
                }
                else {
                    console.error('Failed to fetch rates');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const fetchCurrencies = () => {
        axios.get('http://localhost:3000/currency/public')
            .then(response => {
                if (response.data.success) {
                    setCurrencies(response.data.result);
                }
                else {
                    console.error('Failed to fetch currencies');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        fetchBestRates(currentPage, selectedCurrency); // Double fetch due to the React.StrictMode warning
    }, [currentPage, selectedCurrency, fetchBestRates]);

    const loadNewData = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleCurrencyChange = (event) => {
        setNearestRates([]);
        setSelectedCurrency(event.target.value);
        setCurrentPage(1);
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
        <div className='container-best-rates'>
            <MdOutlineArrowBack className='home-button' onClick={navigateHome} />
            <h1 className='heading-best-rates'><MdOutlineVerified /> Best Rates</h1>
            <select className='form-select main-select' onChange={handleCurrencyChange} value={selectedCurrency}>
                {currencies.map(currency => (
                    <option key={currency.idCurrency} value={currency.idCurrency}>
                        {currency.name}
                    </option>
                ))}
            </select>
            <div className='data-container'>
                {nearestRates.length > 0 ? (
                    <ul>
                        {nearestRates.map((rate, index) => (
                            <div className='container-rate' key={index}>
                                <h3>Address: {rate.address}</h3>
                                <iframe
                                    width="80%"
                                    height="300px"
                                    loading="lazy"
                                    allowFullScreen
                                    src={generateMapUrlFromAddress(rate.address)}
                                ></iframe>
                                <ul>
                                    <li>
                                        <p className="rate-text">Rate: {rate.value}</p>
                                        <p>Date: {new Date(rate.date).toLocaleDateString()}</p>
                                    </li>
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