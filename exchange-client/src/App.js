import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import NearestRates from './Components/NearestRates/NearestRates';
import BestRates from './Components/BestRates/BestRates';
import AllRates from './Components/AllRates/AllRates';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nearest" element={<NearestRates />} />
          <Route path="/best" element={<BestRates />} />
          <Route path="/all" element={<AllRates />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
