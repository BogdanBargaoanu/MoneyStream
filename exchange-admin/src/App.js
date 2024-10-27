import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './Components/Login/LoginPage';
import DashboardPage from './Components/Dashboard/DashboardPage';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute component={DashboardPage} />} />
          <Route path="/" element={<PrivateRoute component={DashboardPage} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
