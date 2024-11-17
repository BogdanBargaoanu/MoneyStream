import React from 'react';
import './Home.css';
import logo from '../Assets/logo.png';
import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineVerified } from "react-icons/md";
import { ImLocation } from "react-icons/im";
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();

    const requireGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const showPosition = (position) => {
        const { latitude, longitude } = position.coords;
        navigate(`/nearest?lat=${latitude}&lng=${longitude}`);
    };

    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
            default:
                alert("An unknown error occurred.");
        }
    };

    const navigateBestRates = () => {
        navigate('/best');
    };

    const navigateAllRates = () => {
        navigate('/all');
    };

    return (
        <div className='container-main'>
            <img className='logo' src={logo} alt='logo' />
            <h1 className='heading-main'>Exchange Monitor v0.1</h1>
            <button className='btn-main' onClick={requireGeolocation}><ImLocation /> Nearest rates</button>
            <button className='btn-main' onClick={navigateBestRates}><MdOutlineVerified /> Best rates</button>
            <button className='btn-main' onClick={navigateAllRates}><PiListBulletsBold /> All rates</button>
        </div>
    );
}

export default Home;