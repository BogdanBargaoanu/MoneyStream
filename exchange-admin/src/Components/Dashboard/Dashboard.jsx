import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Chart } from 'react-google-charts';
import axios from 'axios';

const Dashboard = () => {
    const [rates, setRates] = useState([]);
    const [ratesData, setRatesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/rate`, {
            headers: {
                Authorization: `Bearer ${token}` // send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    const rates = response.data.result;
                    setRates(rates);
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

    const generateSeriesOptions = (numSeries) => {
        const seriesOptions = {};
        for (let i = 0; i < numSeries; i++) {
            seriesOptions[i] = { curveType: 'function', lineWidth: 3 };
        }
        return seriesOptions;
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='main-chart'>
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
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Dashboard;