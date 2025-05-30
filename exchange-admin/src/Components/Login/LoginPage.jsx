import React, { useState } from "react"
import axios from 'axios'
import './LoginPage.css'
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'
import email_icon from '../Assets/email.png'
import { useToast } from "../../Context/Toast/ToastContext"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
    const [action, setAction] = useState("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [userVerificationCode, setUserVerificationCode] = useState("");
    const [authToken, setAuthToken] = useState("");
    const { showToastMessage } = useToast();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogin = () => {
        axios.post(`${apiUrl}/partner/login`, {
            username: username,
            password: password
        })
            .then(response => {
                if (response.data.success) {
                    // The login was successful
                    var authToken = response.data.token;
                    setAuthToken(authToken);
                    setUserVerificationCode(response.data.userVerificationCode);
                    setAction("Verify");
                    // localStorage.setItem('user-token', response.data.token);
                    // navigate('/dashboard');
                }
            })
            .catch(error => {
                showToastMessage('Invalid login: ' + (error.response?.data?.error || 'Unknown error'));
            });
    };

    const handleSignUp = () => {
        axios.post(`${apiUrl}/partner/addPartner`, {
            username: username,
            email: email,
            password: password,
            information: `Registration date:${new Date().toISOString()}`
        })
            .then(response => {
                if (response.data.success) {
                    // The registration was successful
                    setUsername("");
                    setPassword("");
                    showToastMessage('Registration successful. Please check your email for the verification code.');
                    setAction("Verify");
                }
            })
            .catch(error => {
                showToastMessage('Invalid registration: ' + (error.response?.data?.error || 'Unknown error'));
            });
    };

    const handleVerify = () => {
        if (verificationCode !== userVerificationCode) {
            showToastMessage('Invalid verification code. Please try again.');
            return;
        }
        localStorage.setItem('user-token', authToken);
        navigate('/dashboard');
    };

    return (
        <div className="container-login">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Sign Up" && (
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                )}

                {(action === "Login" || action === "Sign Up") && (
                    <>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </>
                )}

                {action === "Verify" && (
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input
                            type="text"
                            placeholder="Enter Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div className="submit-container">
                {action === "Sign Up" && (
                    <div className="submit" onClick={handleSignUp}>Sign-up</div>
                )}
                {action === "Login" && (
                    <div className="submit" onClick={handleLogin}>Login</div>
                )}
                {action === "Verify" && (
                    <div className="submit" onClick={handleVerify}>Verify</div>
                )}
                {action !== "Verify" && (
                    <div className="submit gray" onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}>
                        {action === "Login" ? "Sign-up" : "Login"}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;