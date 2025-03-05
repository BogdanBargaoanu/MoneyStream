import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Currency.css'
import { useToast } from '../../Context/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';

const Currency = () => {
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [name, setName] = useState('');
    const [id, setId] = useState(null);
    const [isFormValidState, setIsFormValidState] = useState(false); // State to track form validity
    const { showToastMessage } = useToast();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchCurrencies = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`${apiUrl}/currency`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    setCurrencies(response.data.result);
                    setFilteredCurrencies(response.data.result);
                }
                else {
                    console.error('Failed to fetch currencies');
                    showToastMessage('Failed to fetch currencies' + response?.data?.error || 'Unknown error');
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to fetch currencies: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    useEffect(() => {
        fetchCurrencies();
        setIsLoading(false);
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => {
        if (value) {
            setFilteredCurrencies(currencies.filter(currency =>
                currency.name && currency.name.toLowerCase().includes(value.toLowerCase())));
        }
        else {
            setFilteredCurrencies(currencies);
        }
    };

    const handleInsertClick = () => {
        setIsFormValidState(false); // Reset form validity state
        setName('');
        setId(null);
    };

    const insertCurrency = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`${apiUrl}/currency/insert`, {
            name: name
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    /*// Assuming the response contains the new currency data
                    const newCurrency = response.data.currency;
                    setCurrencies([...currencies, newCurrency]);
                    setFilteredCurrencies([...filteredCurrencies, newCurrency]);
                    setName('');
                    setId(null);
                    */
                    showToastMessage('Successfully inserted currency');
                    fetchCurrencies();
                    filter(searchValue);
                    setName('');
                    setId(null);
                } else {
                    console.error('Failed to insert currency');
                    showToastMessage('Failed to insert currency:' + response?.data?.error || 'Unknown error');
                }
            })
            .catch(error => {
                showToastMessage('Could not insert currency: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const handleUpdate = (currency) => {
        setIsFormValidState(true); // Set form validity state
        console.log("Button clicked for currency: ", currency);
        setName(currency.name);
        setId(currency.idCurrency);
    };

    const updateCurrency = () => {
        console.log("Updating currency with id: ", id);
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.put(`${apiUrl}/currency/update`, {
            idCurrency: id,
            name: name
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully updated currency');
                    setCurrencies(currencies.map(currency =>
                        currency.idCurrency === id ? { ...currency, name: name } : currency
                    ));
                    setFilteredCurrencies(filteredCurrencies.map(currency =>
                        currency.idCurrency === id ? { ...currency, name: name } : currency
                    ));
                    setName('');
                    setId(null);
                } else {
                    console.error('Failed to update currency');
                    showToastMessage('Failed to update currency:' + response?.data?.error || 'Unknown error');
                }
            })
            .catch(error => {
                showToastMessage('Could not update currency: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const deleteCurrency = (currency) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`${apiUrl}/currency/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: {
                idCurrency: currency.idCurrency // Pass the idCurrency in the data field
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully deleted currency');
                    //setCurrencies(currencies.filter(c => c.idCurrency !== currency.idCurrency));
                    //setFilteredCurrencies(filteredCurrencies.filter(c => c.idCurrency !== currency.idCurrency));
                    fetchCurrencies();
                    filter(searchValue);
                } else {
                    console.error('Failed to delete currency');
                    showToastMessage('Failed to delete currency:' + response?.data?.error || 'Unknown error');
                }
            })
            .catch(error => {
                showToastMessage('Could not delete currency: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            })
    };

    const isFormValid = () => {
        if (!name) {
            showToastMessage('Name is required');
            return false;
        }
        return true;
    };

    const validate = () => {
        setIsFormValidState(name !== '');
    };

    //var data = React.useMemo(() => filteredCurrencies, [filteredCurrencies]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idCurrency",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className='actions-container'>
                        <button onClick={() => handleUpdate(row.original)} type="button" className="btn btn-primary btn-update" data-bs-toggle="modal" data-bs-target="#modal-currency">
                            Update
                        </button>
                        <button className="btn-delete">
                            <span onClick={() => deleteCurrency(row.original)} className="delete-message">CONFIRM DELETE</span>
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
            <div className="input-group mb-3 search-box">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">@</span>
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
            <DataTable columns={columns} data={filteredCurrencies} isLoading={isLoading} />
            <button onClick={() => handleInsertClick()} type="button" className="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-currency">
                Insert
            </button>
            <div id="modal-currency" className="modal" tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Currency</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => { setName(e.target.value); validate(); }}
                                placeholder="Enter currency name"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss={isFormValidState ? "modal" : undefined}
                                onClick={() => {
                                    if (isFormValid()) {
                                        id === null ? insertCurrency() : updateCurrency();
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

export default Currency;