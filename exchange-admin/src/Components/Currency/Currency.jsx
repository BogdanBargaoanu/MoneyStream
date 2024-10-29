import React, { useEffect } from 'react';
import Navbar from '../Dashboard/Navbar'
import axios from 'axios';
import logo from '../Assets/logo.png'
import { useTable } from 'react-table'
import './Currency.css'

const Currency = () => {
    const [currencies, setCurrencies] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchCurrencies = () => {
        axios.get('http://localhost:3000/currency')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setCurrencies(response.data.result);
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

    var data = React.useMemo(() => currencies, [currencies]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idCurrency",
            },
            {
                Header: "Name",
                accessor: "name",
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
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
                </table>)}
            </div>
        </div>
    );
}

export default Currency;