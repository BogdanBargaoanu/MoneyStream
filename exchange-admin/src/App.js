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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/partners" element={<PrivateRoute component={Partners} />} />
          <Route path="/locations" element={<PrivateRoute component={Locations} />} />
          <Route path="/currency" element={<PrivateRoute component={Currency} />} />
          <Route path="/rates" element={<PrivateRoute component={Rates} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
