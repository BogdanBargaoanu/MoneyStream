import React, { createContext, useState, useContext } from 'react';
import { Toast } from 'react-bootstrap';
import logo from '../../Components/Assets/logo.png'; // Adjust the path as necessary

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <ToastContext.Provider value={{ showToastMessage }}>
            {children}
            <Toast position="top-end" className="p-3" style={{ position: 'absolute', top: 5, right: 5 }} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <img src={logo} className="rounded me-2" alt="" height="20px" width="20px" />
                    <strong className="me-auto">Exchange-Admin</strong>
                    <small>Now</small>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);