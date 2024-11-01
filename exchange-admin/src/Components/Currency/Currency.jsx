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
    const [id, setId] = useState(null);

    const fetchCurrencies = () => {
        axios.get('http://localhost:3000/currency')
            .then(response => {
                if (response.data.success) {
                    setCurrencies(response.data.result);
                    setFilteredCurrencies(response.data.result);
                }
                else {
                    console.error('Failed to fetch partners');
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
                        <button onClick={() => handleButtonClick(row.original)} type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCurrency">
                            Update
                        </button>
                        <button type="button" class="btn btn-danger">
                            Delete
                        </button>
                    </>
                ),
            }
        ],
        []
    );

    const handleButtonClick = (row) => {
        console.log("Button clicked for row: ", row);
        setName(row.name);
        setId(row.idCurrency);
    };

    const handleInsertClick = () => {
        setName('');
        setId(null);
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
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Currency;