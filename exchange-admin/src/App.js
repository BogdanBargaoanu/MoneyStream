import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './Components/Login/LoginPage';
import Dashboard from './Components/Dashboard/Dashboard';
import Partners from './Components/Partners/Partners';
import Locations from './Components/Locations/Locations';
import Currency from './Components/Currency/Currency';
import Rates from './Components/Rates/Rates';
import PrivateRoute from './PrivateRoute';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { ToastProvider } from './Context/Toast/ToastContext';
import Navbar from './Components/Navbar/Navbar';
import logo from './Components/Assets/logo.png';

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </div>
  );
}

function AppContent() {
  const location = window.location;

  return (
    <>
      {location.pathname !== '/login' && (
        <>
          <Navbar />
          <img className="logo" src={logo} alt="" />
        </>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/partners" element={<PrivateRoute component={Partners} />} />
        <Route path="/locations" element={<PrivateRoute component={Locations} />} />
        <Route path="/currency" element={<PrivateRoute component={Currency} />} />
        <Route path="/rates" element={<PrivateRoute component={Rates} />} />
      </Routes>
    </>
  );
}

export default App;
