import React from 'react';
import './NearestRates.css';
import { useLocation } from 'react-router-dom';

const NearestRates = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const latitude = queryParams.get('lat');
    const longitude = queryParams.get('lng');

    return (
        <div className='container-nearest-rates'>
            <h1 className='heading-nearest-rates'>Nearest Rates</h1>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
            {/* Logic to fetch and display the nearest rates based on latitude and longitude */}
        </div>
    );
}

export default NearestRates;