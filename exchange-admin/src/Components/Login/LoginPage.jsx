import React, { useState } from "react"
import axios from 'axios'
import './LoginPage.css'
import Toast from 'react-bootstrap/Toast'
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'
import email_icon from '../Assets/email.png'
import { useToast } from "../../Context/Toast/ToastContext"

const LoginPage = () => {
    const [action, setAction] = useState("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { showToastMessage } = useToast();

    const handleLogin = () => {
        axios.post('http://localhost:3000/partners/login', {
            username: username,
            password: password
        })
            .then(response => {
                if (response.data.success) {
                    // The login was successful
                    localStorage.setItem('user-token', response.data.token);
                    window.location.href = '/dashboard';
                }
            })
            .catch(error => {
                showToastMessage('Invalid login: ' + (error.response?.data?.error || 'Unknown error'));
            });
    };

    const handleSignUp = () => {
        axios.post('http://localhost:3000/partners/addPartner', {
            username: username,
            email: email,
            password: password,
            information: `Registration date:${Date.now().toString()}`
        })
            .then(response => {
                if (response.data.success) {
                    // The registration was successful
                    setUsername("");
                    setPassword("");
                    showToastMessage('Registration successful. Please login.');
                    setAction("Login");
                }
            })
            .catch(error => {
                showToastMessage('Invalid registration: ' + (error.response?.data?.error || 'Unknown error'));
            });
    };
    return (
        <div className="container-login">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">

                {action === "Login" ? <div></div> : <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>}

                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { action === "Sign Up" ? handleSignUp() : setAction("Sign Up") }}>Sign-up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { action === "Login" ? handleLogin() : setAction("Login") }}>Login</div>
            </div>
        </div>)
}

export default LoginPage