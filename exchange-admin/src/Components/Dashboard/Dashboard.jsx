import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [rates, setRates] = useState([]);
    const [ratesData, setRatesData] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrencies();
        fetchRates();
    }, []);

    useEffect(() => {
        if (rates) {
            const data = prepareChartData(rates);
            setRatesData(data);
        }
    }, [rates]);

    useEffect(() => {
        if (selectedCurrency) {
            filterChartData(selectedCurrency);
        }
    }, [selectedCurrency]);

    const fetchRates = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/rate`, {
            headers: {
                Authorization: `Bearer ${token}` // send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    setRates(response.data.result);
                } else {
                    console.error('Failed to fetch rates');
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch rates:', error);
                setIsLoading(false);
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            })
    };

    const fetchCurrencies = () => {
        const token = localStorage.getItem('user-token');
        axios.get('http://localhost:3000/currency',
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    setCurrencies(response.data.result);
                }
                else {
                    console.error('Failed to fetch currencies');
                }
            })
            .catch(error => {
                console.error(error);
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const prepareChartData = (rates) => {
        const chartData = [
            ['Date']
        ];

        const groupedRates = {};

        rates.forEach(rate => {
            const date = new Date(rate.date).toLocaleDateString();
            const key = `${rate.address} - ${rate.name}`;
            if (!groupedRates[date]) {
                groupedRates[date] = {};
            }
            groupedRates[date][key] = rate.value;
            if (!chartData[0].includes(key)) {
                chartData[0].push(key);
            }
        });

        Object.keys(groupedRates).forEach(date => {
            const row = [date];
            chartData[0].slice(1).forEach(key => {
                row.push(groupedRates[date][key] || null);
            });
            chartData.push(row);
        });

        return chartData;
    };

    const filterChartData = (currencyId) => {
        const filteredRates = rates.filter(rate => rate.idCurrency === parseInt(currencyId));
        const data = prepareChartData(filteredRates);
        setRatesData(data);
    };

    const generateSeriesOptions = (numSeries) => {
        const seriesOptions = {};
        for (let i = 0; i < numSeries; i++) {
            seriesOptions[i] = { curveType: 'function', lineWidth: 3 };
        }
        console.log(seriesOptions);
        console.log(ratesData);
        return seriesOptions;
    };

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='main-chart'>
                    <select className='form-select main-select' onChange={handleCurrencyChange} value={selectedCurrency}>
                        <option value='' selected disabled>Select a currency</option>
                        {currencies.map(currency => (
                            <option key={currency.idCurrency} value={currency.idCurrency}>
                                {currency.name}
                            </option>
                        ))}
                    </select>
                    <Chart
                        width={'100%'}
                        height={'85%'}
                        chartType="LineChart"
                        loader={<div>Loading Chart...</div>}
                        data={ratesData}
                        options={{
                            title: 'Currency Rates by Location and Currency',
                            hAxis: {
                                title: 'Date',
                                textStyle: { color: '#FFF' }, // Set axis text color to white
                                titleTextStyle: { color: '#FFF' } // Set axis title text color to white
                            },
                            vAxis: {
                                title: 'Rate',
                                textStyle: { color: '#FFF' }, // Set axis text color to white
                                titleTextStyle: { color: '#FFF' } // Set axis title text color to white
                            },
                            backgroundColor: 'transparent', // Set background to transparent
                            titleTextStyle: { color: '#FFF' }, // Set chart title text color to white
                            legend: {
                                textStyle: { color: '#FFF' } // Set legend text color to white
                            },
                            series: generateSeriesOptions(ratesData[0].length - 1), // Generate series options dynamically
                            explorer: {
                                actions: ['dragToZoom', 'rightClickToReset'], // Enable zooming and panning
                                axis: 'horizontal', // Allow zooming on the horizontal axis
                                keepInBounds: true, // Keep the zoomed area within the chart bounds
                                maxZoomIn: 4.0 // Maximum zoom level
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Dashboard;