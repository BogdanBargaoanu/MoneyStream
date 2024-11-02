import React, { useEffect, useState } from 'react';
import Navbar from '../Dashboard/Navbar'
import axios from 'axios';
import logo from '../Assets/logo.png'
import { useTable } from 'react-table'
import './Currency.css'

const Currency = () => {
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [name, setName] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [id, setId] = useState(null);

    const fetchCurrencies = () => {
        const token = localStorage.getItem('user-token');
        axios.get('http://localhost:3000/currency', {
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
                    console.error('Failed to fetch partners');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }

            })
            .catch(error => {
                console.error(error);
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

    var data = React.useMemo(() => filteredCurrencies, [filteredCurrencies]);
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
                    <>
                        <button onClick={() => handleUpdate(row.original)} type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCurrency">
                            Update
                        </button>
                        <button class="btn-delete" onClick={(e) => toggleDeleteConfirmation(e, row.original)}>
                            <span class="delete-message">CONFIRM DELETE</span>
                            <svg className="delete-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </>
                ),
            }
        ],
        []
    );

    const handleUpdate = (currency) => {
        console.log("Button clicked for row: ", currency);
        setName(currency.name);
        setId(currency.idCurrency);
    };

    const toggleDeleteConfirmation = (event, currency) => {
        console.log(showDeleteConfirmation);
        if (!showDeleteConfirmation) {
            event.stopPropagation();
            setShowDeleteConfirmation(!showDeleteConfirmation);
            return;
        }
        else {
            console.log("Deleting currency: ", currency);
            deleteCurrency(currency);
        }
        setShowDeleteConfirmation(false);
    };

    const deleteCurrency = (currency) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`http://localhost:3000/currency/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: { idCurrency: currency.idCurrency }
        })
            .then(response => {
                if (response.data.success) {
                    setCurrencies(currencies.filter(c => c.idCurrency !== currency.idCurrency));
                    setFilteredCurrencies(filteredCurrencies.filter(c => c.idCurrency !== currency.idCurrency));
                } else {
                    console.error('Failed to delete currency');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                console.error('Error deleting currency:', error);
            });
    };

    const handleInsertClick = () => {
        setName('');
        setId(null);
    };

    const insertCurrency = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`http://localhost:3000/currency/insert`, {
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
                    fetchCurrencies();
                    filter(searchValue);
                    setName('');
                    setId(null);
                } else {
                    console.error('Failed to insert currency');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                console.error('Error inserting currency:', error);
            });
    };

    const updateCurrency = () => {
        console.log("Updating currency with id: ", id);
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
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
            <div id="currency-table" className="table-container">
                {isLoading ? (<h1>Loading currencies...</h1>) : (<table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </div>
            <button onClick={() => handleInsertClick()} type="button" class="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modalCurrency">
                Insert
            </button>
            <div id="modalCurrency" class="modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Currency</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter currency name"
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => id === null ? insertCurrency() : updateCurrency()}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Currency;