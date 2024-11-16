import React from 'react';
import './Home.css';
import logo from '../Assets/logo.png';

const Home = () => {
    return (
        <div className='container-main'>
            <img className='logo' src={logo} alt='logo' />
            <h1 className='heading-main'>Exchange Monitor</h1>
            <button className='btn-main'>Nearest rates</button>
            <button className='btn-main'>Best rates</button>
            <button className='btn-main'>All rates</button>
        </div>
    );
}

export default Home;