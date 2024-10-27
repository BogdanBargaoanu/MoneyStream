import React from 'react';

const Navbar = () => {
    return (
        <div className='sidenav'>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href='/dashboard'>Partners</a></li>
                <li><a href='/dashboard'>Currency</a></li>
                <li><a href='/dashboard'>Rates</a></li>
            </ul>
        </div>
    );
}

export default Navbar;