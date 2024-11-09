import React, { useEffect, useState } from 'react';
import Navbar from '../Dashboard/Navbar'
import logo from '../Assets/logo.png'
import './Locations.css'
import { useTable } from 'react-table'
import { useToast } from '../../Context/Toast/ToastContext';
import axios from 'axios';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({
        idLocation: null,
        address: '',
        latitude: null,
        longitude: null,
        information: ''
    });
    const { showToastMessage } = useToast();

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
                    setFilteredLocations(response.data.result);
                }
                else {
                    console.error('Failed to fetch locations');
                    if (response?.data?.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }

            })
            .catch(error => {
                console.error(error);
                if (error.response.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.location.href = '/dashboard';
                }
            });
    };
    useEffect(() => {
        fetchLocations();
        setIsLoading(false);
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => {
        if (value) {
            setFilteredLocations(locations.filter(location =>
                location.address && location.address.toLowerCase().includes(value.toLowerCase())));
        }
        else {
            setFilteredLocations(locations);
        }
    };

    var data = React.useMemo(() => filteredLocations, [filteredLocations]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idLocation",
            },
            {
                Header: "Address",
                accessor: "address",
            },
            {
                Header: "Latitude",
                accessor: "latitude",
            },
            {
                Header: "Longitude",
                accessor: "longitude",
            },
            {
                Header: "Information",
                accessor: "information",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <>
                        <button onClick={() => handleUpdate(row.original)} type="button" className="btn btn-primary btn-update" data-bs-toggle="modal" data-bs-target="#modal-location">
                            Update
                        </button>
                        <button className="btn-delete">
                            <span onClick={() => deleteLocation(row.original)} className="delete-message">CONFIRM DELETE</span>
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

    const handleUpdate = (location) => {
        console.log("Button clicked for location: ", location);
        setCurrentLocation(location);
    };

    const deleteLocation = (location) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`http://localhost:3000/location/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: {
                idLocation: location.idLocation // Pass the idLocation in the data field
            }
        })
            .then(response => {
                if (response.data.success) {
                    setLocations(locations.filter(l => l.idLocation !== location.idLocation));
                    setFilteredLocations(filteredLocations.filter(l => l.idLocation !== location.idLocation));
                } else {
                    console.error('Failed to delete location');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                showToastMessage('Could not delete location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.location.href = '/dashboard';
                }
            })
    };

    const handleInsertClick = () => {
        resetLocation();
    };

    const resetLocation = () => {
        setCurrentLocation({
            idLocation: null,
            address: '',
            latitude: null,
            longitude: null,
            information: ''
        });
    };

    const insertLocation = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`http://localhost:3000/location/insert`, {
            address: currentLocation.address,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            information: currentLocation.information
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    /*// Assuming the response contains the new location data
                    const newLocation = response.data.location;
                    setLocations([...locations, newLocation]);
                    setFilteredLocations([...filteredlocations, newLocation]);
                    setLocation({
                        idLocation: null,
                        address: '',
                        latitude: null,
                        longitude: null,
                        information: ''
                    });*/
                    fetchLocations();
                    filter(searchValue);
                    resetLocation();
                } else {
                    console.error('Failed to insert location');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.location.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                showToastMessage('Could not insert location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.location.href = '/dashboard';
                }
            });
    };

    const updateLocation = () => {
        console.log("Updating location with id: ", currentLocation.idLocation);
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.put(`http://localhost:3000/location/update`, {
            idLocation: currentLocation.idLocation,
            address: currentLocation.address,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            information: currentLocation.information
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    setLocations(locations.map(location =>
                        location.idLocation === currentLocation.idLocation ? {
                            ...location, address: currentLocation.address
                            , latitude: currentLocation.latitude, longitude: currentLocation.longitude, information: currentLocation.information
                        } : location
                    ));
                    setFilteredLocations(filteredLocations.map(location =>
                        location.idLocation === currentLocation.idLocation ? {
                            ...location, address: currentLocation.address
                            , latitude: currentLocation.latitude, longitude: currentLocation.longitude, information: currentLocation.information
                        } : location
                    ));
                } else {
                    console.error('Failed to update location');
                }
            })
            .catch(error => {
                showToastMessage('Could not update location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.location.href = '/dashboard';
                }
            });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        ...currentLocation,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };
    const generateMapUrl = (address) => {
        if (address) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=10&maptype=roadmap`;
        }
        return '';
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
            <div id="location-table" className="table-container">
                {isLoading ? (<h1>Loading locations...</h1>) : (<table {...getTableProps()}>
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
            <button onClick={() => handleInsertClick()} type="button" class="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-location">
                Insert
            </button>
            <div id="modal-location" class="modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Location</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input
                                type="text"
                                className="form-control location-input"
                                value={currentLocation.address}
                                onChange={(e) => setCurrentLocation({ ...currentLocation, address: e.target.value })}
                                placeholder="Enter address"
                            />
                            <input
                                type="number"
                                className="form-control location-input"
                                value={currentLocation.latitude !== null ? currentLocation.latitude : ''}
                                onChange={(e) => setCurrentLocation({ ...currentLocation, latitude: e.target.value })}
                                placeholder="Enter latitude"
                            />
                            <input
                                type="number"
                                className="form-control location-input"
                                value={currentLocation.longitude !== null ? currentLocation.longitude : ''}
                                onChange={(e) => setCurrentLocation({ ...currentLocation, longitude: e.target.value })}
                                placeholder="Enter longitude"
                            />
                            <input
                                type="text"
                                className="form-control location-input"
                                value={currentLocation.information}
                                onChange={(e) => setCurrentLocation({ ...currentLocation, information: e.target.value })}
                                placeholder="Enter information"
                            />
                            <button onClick={() => getCurrentLocation()} type="button" class="btn btn-primary" style={{ marginTop: 10 }}>
                                Get current location
                            </button>
                            <div className="mapswrapper">
                                <iframe
                                    width="100%"
                                    height="300px"
                                    loading="lazy"
                                    allowFullScreen
                                    src={generateMapUrl(currentLocation.address)}
                                ></iframe>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => currentLocation.idLocation === null ? insertLocation() : updateLocation()}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Locations;