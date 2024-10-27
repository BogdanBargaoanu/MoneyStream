import React, { useEffect } from 'react';
import Navbar from '../Dashboard/Navbar'
import axios from 'axios';
//import fakeData from "./MOCK_DATA.json";
import logo from '../Assets/logo.png'
import { useTable } from 'react-table'
import './Partners.css'

const Partners = () => {
    const [partners, setPartners] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchPartners = () => {
        axios.get('http://localhost:3000/partners')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
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
    useEffect(() => {
        fetchPartners();
        setIsLoading(false);
    }, []);

    var data = React.useMemo(() => partners, [partners]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idPartner",
            },
            {
                Header: "Username",
                accessor: "username",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Information",
                accessor: "information",
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
            <div className="table-container">
                {isLoading ? (<h1>Loading partners...</h1>) : (<table {...getTableProps()}>
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

export default Partners;