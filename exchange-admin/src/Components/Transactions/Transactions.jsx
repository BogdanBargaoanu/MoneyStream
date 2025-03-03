import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css'
import { useToast } from '../../Context/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [rates, setRates] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [isFormValidState, setIsFormValidState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showToastMessage } = useToast();
    const navigate = useNavigate();

    const fetchTransactions = () => {
        const token = localStorage.getItem('user-token');
        axios.get('http://localhost:3000/transaction',
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setTransactions(response.data.result);
                }
                else {
                    console.error('Failed to fetch transactions');
                    showToastMessage('Failed to fetch transactions' + (response?.data?.error || ''));
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to fetch transactions: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    }

    const fetchRates = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/rate`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    setRates(response.data.result);
                }
                else {
                    console.error('Failed to fetch rates');
                    showToastMessage('Failed to fetch rates' + (response?.data?.error || ''));
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to fetch rates: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
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
                    showToastMessage('Failed to fetch currencies' + (response?.data?.error || ''));
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

    const fetchLocations = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/location/partner`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    setLocations(response.data.result);
                }
                else {
                    console.error('Failed to fetch locations' + (response?.data?.error || ''));
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

    useEffect(() => {
        fetchTransactions();
        setIsLoading(false);
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => { };

    const deleteTransaction = (transaction) => {
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idTransaction",
            },
            {
                Header: "Address",
                accessor: "mainAddress",
            },
            {
                Header: "Currency",
                accessor: "mainCurrency",
            },
            {
                Header: "Rate",
                accessor: "mainRateValue",
            },
            {
                Header: "Partner",
                accessor: "partnerUsername",
            },
            {
                Header: "Partner address",
                accessor: "partnerAddress",
            },
            {
                Header: "Partner currency",
                accessor: "partnerCurrency",
            },
            {
                Header: "Partner rate",
                accessor: "partnerRateValue",
            },
            {
                Header: "Value",
                accessor: "transactionValue",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className='actions-container'>
                        <button className="btn-delete">
                            <span onClick={() => deleteTransaction(row.original)} className="delete-message">CONFIRM DELETE</span>
                            <svg className="delete-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ),
            }
        ],
        []
    );

    return (
        <div>
            <div class="input-group mb-3 search-box">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">@</span>
                </div>
                <input
                    className='form-control'
                    type="text"
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={handleSearch}
                    style={{ marginBottom: 20 }}
                />
            </div>
            <DataTable columns={columns} data={transactions} isLoading={isLoading} />
        </div>
    );
}

export default Transactions;