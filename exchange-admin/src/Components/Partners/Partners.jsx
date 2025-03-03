import React, { useEffect, useMemo } from 'react';
import axios from 'axios';
//import fakeData from "./MOCK_DATA.json";
import './Partners.css'
import DataTable from '../DataTable/DataTable';

const Partners = () => {
    const [partners, setPartners] = React.useState([]);
    const [filteredPartners, setFilteredPartners] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState(null);

    const fetchPartners = () => {
        axios.get('http://localhost:3000/partner')
            .then(response => {
                if (response.data.success) {
                    setPartners(response.data.result);
                    setFilteredPartners(response.data.result);
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

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => {
        if (value) {
            setFilteredPartners(partners.filter(partner =>
                partner.username && partner.username.toLowerCase().includes(value.toLowerCase())));
        }
        else {
            setFilteredPartners(partners);
        }
    };

    //var data = useMemo(() => filteredPartners, [filteredPartners]);
    const columns = useMemo(
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

    return (
        <div>
            <div className="input-group mb-3 search-box">
                <div className="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">@</span>
                </div>
                <input
                    className='form-control partner-search'
                    type="text"
                    placeholder="Search by username"
                    value={searchValue}
                    onChange={handleSearch}
                    style={{ marginBottom: 20 }}
                />
            </div>
            <DataTable columns={columns} data={filteredPartners} isLoading={isLoading} />
        </div>
    );
}

export default Partners;