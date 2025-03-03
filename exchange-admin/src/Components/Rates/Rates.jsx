import React, { useEffect, useState } from 'react';
import './Rates.css'
import { useToast } from '../../Context/Toast/ToastContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';

const Rates = () => {
    const [rates, setRates] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState(null);
    const [isFormValidState, setIsFormValidState] = useState(false); // State to track form validity
    const [currentRate, setCurrentRate] = useState({
        idRates: null,
        idLocation: null,
        idCurrency: null,
        date: null,
        value: null
    });
    const { showToastMessage } = useToast();
    const navigate = useNavigate();

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
        fetchRates();
        fetchCurrencies();
        fetchLocations();
        setIsLoading(false);
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => { };

    const resetRate = () => {
        setCurrentRate({
            idRates: null,
            idrate: null,
            idCurrency: null,
            date: null,
            value: null
        });
    };

    const handleInsertClick = () => {
        setIsFormValidState(false);
        resetRate();
    };

    const insertRate = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`http://localhost:3000/rate/insert`, {
            idLocation: currentRate.idLocation,
            idCurrency: currentRate.idCurrency,
            date: currentRate.date,
            value: currentRate.value
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully inserted rate');
                    fetchRates();
                    //filter(searchValue);
                    resetRate();
                } else {
                    console.error('Failed to insert rate');
                    showToastMessage('Failed to insert rate' + (response?.data?.error || ''));
                }
            })
            .catch(error => {
                showToastMessage('Could not insert rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const handleUpdate = (rate) => {
        setIsFormValidState(true); // Set form validity state
        console.log("Button clicked for rate: ", rate);
        const formattedDate = rate.date ? new Date(rate.date).toISOString().split('T')[0] : '';

        setCurrentRate({
            ...rate,
            date: formattedDate
        });
    };

    const updateRate = () => {
        console.log("Updating rate with id: ", currentRate.idrate);
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.put(`http://localhost:3000/rate/update`, {
            idRates: currentRate.idRates,
            idLocation: currentRate.idLocation,
            idCurrency: currentRate.idCurrency,
            date: currentRate.date,
            value: currentRate.value
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully updated rate');
                    fetchRates();
                } else {
                    console.error('Failed to update rate');
                    showToastMessage('Failed to update rate' + (response?.data?.error || ''));
                }
            })
            .catch(error => {
                showToastMessage('Could not update rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const deleteRate = (rate) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`http://localhost:3000/rate/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: {
                idRates: rate.idRates // Pass the idrate in the data field
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully deleted rate');
                    fetchRates();
                } else {
                    console.error('Failed to delete rate');
                    showToastMessage('Failed to delete rate' + (response?.data?.error || ''));
                }
            })
            .catch(error => {
                showToastMessage('Could not delete rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            })
    };

    const isFormValid = () => {
        if (!currentRate.idLocation) {
            showToastMessage('Location is required');
            return false;
        }
        if (!currentRate.idCurrency) {
            showToastMessage('Currency is required');
            return false;
        }
        if (!currentRate.date) {
            showToastMessage('Date is required');
            return false;
        }
        if (currentRate.value === null) {
            showToastMessage('Value is required');
            return false;
        }
        return true;
    };

    const validate = () => {
        setIsFormValidState(currentRate.idLocation && currentRate.idCurrency && currentRate.date && currentRate.value !== null);
    };

    //var data = React.useMemo(() => rates, [rates]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idRates",
            },
            {
                Header: "Address",
                accessor: "address",
            },
            {
                Header: "Currency",
                accessor: "name",
            },
            {
                Header: "Date",
                accessor: "date",
            },
            {
                Header: "Value",
                accessor: "value",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className='actions-container'>
                        <button onClick={() => handleUpdate(row.original)} type="button" className="btn btn-primary btn-update" data-bs-toggle="modal" data-bs-target="#modal-rate">
                            Update
                        </button>
                        <button className="btn-delete">
                            <span onClick={() => deleteRate(row.original)} className="delete-message">CONFIRM DELETE</span>
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
            <DataTable columns={columns} data={rates} isLoading={isLoading} />
            <button onClick={() => handleInsertClick()} type="button" class="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-rate">
                Insert
            </button>
            <div id="modal-rate" className="modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Rate</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <select
                                className="form-control rate-input"
                                value={currentRate.idLocation || ''}
                                onChange={(e) => { setCurrentRate({ ...currentRate, idLocation: e.target.value }); validate() }}
                            >
                                <option value="" disabled>Select Location</option>
                                {locations.map(location => (
                                    <option key={location.idLocation} value={location.idLocation}>
                                        {location.address}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control rate-input"
                                value={currentRate.idCurrency || ''}
                                onChange={(e) => { setCurrentRate({ ...currentRate, idCurrency: e.target.value }); validate() }}
                            >
                                <option value="" disabled>Select Currency</option>
                                {currencies.map(currency => (
                                    <option key={currency.idCurrency} value={currency.idCurrency}>
                                        {currency.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                className="form-control rate-input"
                                value={currentRate.date || ''}
                                onChange={(e) => { setCurrentRate({ ...currentRate, date: e.target.value }); validate() }}
                                placeholder="Enter date"
                            />
                            <input
                                type="number"
                                className="form-control rate-input"
                                value={currentRate.value !== null ? currentRate.value : ''}
                                onChange={(e) => { setCurrentRate({ ...currentRate, value: e.target.value }); validate() }}
                                placeholder="Enter value"
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss={isFormValidState ? "modal" : undefined}
                                onClick={() => {
                                    if (isFormValid()) {
                                        currentRate.idRates === null ? insertRate() : updateRate();
                                    } else {
                                        setIsFormValidState(false); // Set form validity state
                                    }
                                }}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rates;