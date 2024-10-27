import React from 'react';
import Navbar from '../Dashboard/Navbar'
import fakeData from "./MOCK_DATA.json";
import logo from '../Assets/logo.png'
import { useTable } from 'react-table'
import './Partners.css'

const Partners = () => {
    const data = React.useMemo(() => fakeData, []);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "First Name",
                accessor: "first_name",
            },
            {
                Header: "Last Name",
                accessor: "last_name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Gender",
                accessor: "gender",
            },
            {
                Header: "University",
                accessor: "university",
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
                <table {...getTableProps()}>
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
            </div>
        </div>
    );
}

export default Partners;