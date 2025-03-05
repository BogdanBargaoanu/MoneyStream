import React, { useEffect, useState } from 'react';
import './Locations.css'
import { useToast } from '../../Context/Toast/ToastContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';


const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [isFormValidState, setIsFormValidState] = useState(false); // State to track form validity
    const [currentLocation, setCurrentLocation] = useState({
        idLocation: null,
        address: '',
        latitude: null,
        longitude: null,
        information: ''
    });
    const { showToastMessage } = useToast();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchLocations = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`${apiUrl}/location/partner`,
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
                    showToastMessage('Failed to fetch locations' + (response?.data?.error || 'Unknown error'));
                }

            })
            .catch(error => {
                showToastMessage('Failed to fetch locations: ' + (error.response?.data?.error || 'Unknown error'));
                console.error(error);
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
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

    const resetLocation = () => {
        setCurrentLocation({
            idLocation: null,
            address: '',
            latitude: null,
            longitude: null,
            information: ''
        });
    };

    const handleInsertClick = () => {
        setIsFormValidState(false); // Reset form validity state
        resetLocation();
    };

    const insertLocation = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`${apiUrl}/location/insert`, {
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
                    showToastMessage('Successfully inserted location');
                    fetchLocations();
                    filter(searchValue);
                    resetLocation();
                } else {
                    console.error('Failed to insert location');
                    showToastMessage('Failed to insert location:' + (response?.data?.error || 'Unknown error'));
                }
            })
            .catch(error => {
                showToastMessage('Could not insert location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const handleUpdate = (location) => {
        setIsFormValidState(true); // Set form validity state
        console.log("Button clicked for location: ", location);
        setCurrentLocation(location);
    };

    const updateLocation = () => {
        console.log("Updating location with id: ", currentLocation.idLocation);
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.put(`${apiUrl}/location/update`, {
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
                    showToastMessage('Successfully updated location');
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
                    showToastMessage('Failed to update location' + (response?.data?.error || 'Unknown error'));
                }
            })
            .catch(error => {
                showToastMessage('Could not update location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            });
    };

    const deleteLocation = (location) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`${apiUrl}/location/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: {
                idLocation: location.idLocation // Pass the idLocation in the data field
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully deleted location');
                    setLocations(locations.filter(l => l.idLocation !== location.idLocation));
                    setFilteredLocations(filteredLocations.filter(l => l.idLocation !== location.idLocation));
                } else {
                    console.error('Failed to delete location');
                    showToastMessage('Failed to delete location' + (response?.data?.error || 'Unknown error'));
                }
            })
            .catch(error => {
                showToastMessage('Could not delete location: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header' || error.response?.data?.error === 'Invalid token') {
                    localStorage.removeItem('user-token');
                    navigate('/login');
                }
            })
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
                    showToastMessage('Error getting current location');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            showToastMessage('Geolocation is not supported by this browser.');
        }
    };

    const generateMapUrlFromAddress = (address) => {
        if (address) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=10&maptype=roadmap`;
        }
        return '';
    };

    var generateMapUrl = (latitude, longitude) => {
        if (latitude && longitude) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&hl=es;z=14&amp;&zoom=10&maptype=roadmap`;
        }
        return '';
    };

    const isFormValid = () => {
        if (!currentLocation.address) {
            showToastMessage('Address is required');
            return false;
        }
        if (currentLocation.latitude === null) {
            showToastMessage('Latitude is required');
            return false;
        }
        if (currentLocation.longitude === null) {
            showToastMessage('Longitude is required');
            return false;
        }
        if (!currentLocation.information) {
            showToastMessage('Information is required');
            return false;
        }
        return true;
    };

    const validate = () => {
        setIsFormValidState(currentLocation.address !== '' && currentLocation.latitude !== null && currentLocation.longitude !== null && currentLocation.information !== '');
    };

    //var data = React.useMemo(() => filteredLocations, [filteredLocations]);
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
                    <div className='actions-container'>
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
            <DataTable columns={columns} data={filteredLocations} isLoading={isLoading} />
            <button onClick={() => handleInsertClick()} type="button" className="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-location">
                Insert
            </button>
            <div id="modal-location" className="modal" tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Location</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control location-input"
                                value={currentLocation.address}
                                onChange={(e) => { setCurrentLocation({ ...currentLocation, address: e.target.value }); validate() }}
                                placeholder="Enter address"
                            />
                            <input
                                type="number"
                                className="form-control location-input"
                                value={currentLocation.latitude !== null ? currentLocation.latitude : ''}
                                onChange={(e) => { setCurrentLocation({ ...currentLocation, latitude: e.target.value }); validate() }}
                                placeholder="Enter latitude"
                            />
                            <input
                                type="number"
                                className="form-control location-input"
                                value={currentLocation.longitude !== null ? currentLocation.longitude : ''}
                                onChange={(e) => { setCurrentLocation({ ...currentLocation, longitude: e.target.value }); validate() }}
                                placeholder="Enter longitude"
                            />
                            <input
                                type="text"
                                className="form-control location-input"
                                value={currentLocation.information}
                                onChange={(e) => { setCurrentLocation({ ...currentLocation, information: e.target.value }); validate() }}
                                placeholder="Enter information"
                            />
                            <button onClick={() => getCurrentLocation()} type="button" class="btn btn-primary" style={{ marginTop: 10 }}>
                                Get current location
                            </button>
                            <div className="maps-wrapper">
                                <iframe
                                    width="100%"
                                    height="300px"
                                    loading="lazy"
                                    allowFullScreen
                                    src={generateMapUrlFromAddress(currentLocation.address)}
                                ></iframe>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss={isFormValidState ? "modal" : undefined}
                                onClick={() => {
                                    if (isFormValid()) {
                                        currentLocation.idLocation === null ? insertLocation() : updateLocation();
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

export default Locations;