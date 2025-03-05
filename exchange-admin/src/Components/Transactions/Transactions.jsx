import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css'
import { useToast } from '../../Context/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [rates, setRates] = useState([]);
    const [partnerRates, setPartnerRates] = useState([]);
    const [partners, setPartners] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [isFormValidState, setIsFormValidState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTransaction, setCurrentTransaction] = useState({
        idRate: null,
        idPartnerRate: null,
        idPartner: null,
        transactionValue: null,
    });
    const { showToastMessage } = useToast();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchTransactions = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`${apiUrl}/transaction`,
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

    const fetchRates = useCallback((idPartner) => {
        const url = idPartner ? `${apiUrl}/rate/${idPartner}` : `${apiUrl}/rate`;
        const token = localStorage.getItem('user-token');
        axios.get(url,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    if (idPartner) {
                        setPartnerRates(response.data.result);
                    }
                    else {
                        setRates(response.data.result);
                    }
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
    }, [currentTransaction.idPartner]);

    useEffect(() => {
        fetchTransactions();
        setIsLoading(false);
    }, []);

    const fetchPartners = () => {
        axios.get(`${apiUrl}/partner`)
            .then(response => {
                if (response.data.success) {
                    setPartners(response.data.result);
                }
                else {
                    console.error('Failed to fetch partners');
                }

            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => { };

    const resetTransaction = () => {
        setCurrentTransaction({
            idRate: null,
            idPartnerRate: null,
            idPartner: null,
            transactionValue: null,
        });
        setPartnerRates([]);
    };

    const handleInsertClick = async () => {
        setIsFormValidState(false);
        fetchRates();
        fetchPartners();
        resetTransaction();
    };

    const insertRate = () => {
        const token = localStorage.getItem('user-token');
        console.log(currentTransaction);
        axios.post(`${apiUrl}/transaction`, {
            idRate: currentTransaction.idRate,
            idPartnerRate: currentTransaction.idPartnerRate,
            value: currentTransaction.transactionValue
        },
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Transaction inserted successfully');
                    fetchTransactions();
                }
                else {
                    console.error('Failed to insert transaction');
                    showToastMessage('Failed to insert transaction' + (response?.data?.error || ''));
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to insert transaction: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const deleteTransaction = (transaction) => {
        const token = localStorage.getItem('user-token');
        axios.delete(`${apiUrl}/transaction/delete`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                },
                data: {
                    idTransaction: transaction.idTransaction
                }
            })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Transaction deleted successfully');
                    fetchTransactions();
                }
                else {
                    console.error('Failed to delete transaction');
                    showToastMessage('Failed to delete transaction' + (response?.data?.error || ''));
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to delete transaction: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const isFormValid = () => {
        if (!currentTransaction.idRate) {
            showToastMessage('Rate is required');
            return false;
        }
        if (!currentTransaction.idPartnerRate) {
            showToastMessage('Partner rate is required');
            return false;
        }
        if (currentTransaction.transactionValue === null) {
            showToastMessage('Value is required');
            return false;
        }
        return true;
    };

    const validate = () => {
        setIsFormValidState(currentTransaction.idRate && currentTransaction.idPartnerRate && currentTransaction.transactionValue !== null);
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
            <DataTable columns={columns} data={transactions} isLoading={isLoading} />
            <button onClick={() => handleInsertClick()} type="button" className="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-transaction">
                Insert
            </button>
            <div id="modal-transaction" className='modal' tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transaction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <select
                                className="form-control transaction-input"
                                value={currentTransaction.idRate || ''}
                                onChange={(e) => { setCurrentTransaction({ ...currentTransaction, idRate: parseInt(e.target.value) }); validate(); }}
                            >
                                <option value="" disabled>Select Rate</option>
                                {rates.map(rate => (
                                    <option key={rate.idRates} value={rate.idRates}>{rate.name}, {rate.value}, {rate.address}</option>
                                ))}
                            </select>
                            <select
                                className="form-control transaction-input"
                                value={currentTransaction.idPartner || ''}
                                onChange={(e) => { setCurrentTransaction({ ...currentTransaction, idPartner: e.target.value }); fetchRates(e.target.value); validate(); }}
                            >
                                <option value="" disabled>Select Partner</option>
                                {partners.map(partner => (
                                    <option key={partner.idPartner} value={partner.idPartner}>{partner.username}, {partner.email}</option>
                                ))}
                            </select>
                            <select
                                className="form-control transaction-input"
                                value={currentTransaction.idPartnerRate || ''}
                                onChange={(e) => { setCurrentTransaction({ ...currentTransaction, idPartnerRate: parseInt(e.target.value) }); validate(); }}
                            >
                                <option value="" disabled>Select Partner Rate</option>
                                {partnerRates.map(rate => (
                                    <option key={rate.idRates} value={rate.idRates}>{rate.name}, {rate.value}, {rate.address}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="form-control transaction-input"
                                value={currentTransaction.transactionValue !== null ? currentTransaction.transactionValue : ''}
                                onChange={(e) => { setCurrentTransaction({ ...currentTransaction, transactionValue: e.target.value }); validate(); }}
                                placeholder="Enter value"
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
                                        insertRate();
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

export default Transactions;