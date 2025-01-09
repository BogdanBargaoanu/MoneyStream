import React from 'react';
import './Home.css';
import logo from '../Assets/logo.png';
import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineVerified } from "react-icons/md";
import { ImLocation } from "react-icons/im";
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();

    const requireGeolocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }
    
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    
            if (permissionStatus.state === 'granted') {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else if (permissionStatus.state === 'prompt') {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                alert("Permission to access location is denied. Please enable it in your device settings.");
            }
        } catch (error) {
            alert('An error occurred while checking permissions: ' + error.message);
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
            <h1 className='heading-main'>MoneyStream v0.1</h1>
            <button className='btn-main' onClick={requireGeolocation}><ImLocation /> Nearest rates</button>
            <button className='btn-main' onClick={navigateBestRates}><MdOutlineVerified /> Best rates</button>
            <button className='btn-main' onClick={navigateAllRates}><PiListBulletsBold /> All rates</button>
        </div>
    );
}

export default Home;