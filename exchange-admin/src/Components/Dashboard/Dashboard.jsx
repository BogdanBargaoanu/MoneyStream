import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Chart } from 'react-google-charts';
import axios from 'axios';

const Dashboard = () => {
    const [ratesData, setRatesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRatesData();
    }, []);

    const fetchRatesData = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/rate`, {
            headers: {
                Authorization: `Bearer ${token}` // send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    const rates = response.data.result;
                    const data = prepareChartData(rates);
                    setRatesData(data);
                } else {
                    console.error('Failed to fetch rates');
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch rates:', error);
                setIsLoading(false);
            });
    };

    const prepareChartData = (rates) => {
        const chartData = [
            ['Date', 'Currency 1', 'Currency 2', 'Currency 3']
        ];

        rates.forEach(rate => {
            const date = new Date(rate.date).toLocaleDateString();
            const currency1 = rate.currency1; // Replace with actual currency field
            const currency2 = rate.currency2; // Replace with actual currency field
            const currency3 = rate.currency3; // Replace with actual currency field
            chartData.push([date, currency1, currency2, currency3]);
        });

        return chartData;
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <Chart
                    width={'100%'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart...</div>}
                    data={ratesData}
                    options={{
                        title: 'Currency Rates',
                        hAxis: { title: 'Date' },
                        vAxis: { title: 'Rate' },
                        series: {
                            1: { curveType: 'function' },
                        },
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;