import React from 'react';
import './Navbar.css';

const Navbar = ({onLogout}) => {
    return (
        <div className='nav'>
            <div className="nav-logo">Rhema Gallery</div>
            <ul className="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li> 
                <li><a href="/library">Library</a></li>
                <li><a href="/chat">Chat</a></li>
                <li><a href="/Upload">Upload</a></li>
                <li><a href="/login" className="button">Login</a></li>
                <button onClick={onLogout}>Logout</button>
            </ul>
        </div>
    );
}

export default Navbar;
