import { useState, useEffect } from 'react';
import './styles/MyTrips.css';
import { useNavigate } from 'react-router-dom';

function MyTrips({ onNavigate, darkMode }) {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const savedTrips = JSON.parse(localStorage.getItem('travelPlans')) || [];
            setTrips(savedTrips);
            setFilteredTrips(savedTrips);
        } catch (error) {
            console.error('Error parsing travel plans from localStorage:', error);
            setTrips([]);
            setFilteredTrips([]);
        }
    }, []);

    useEffect(() => {
        const filtered = trips.filter(trip =>
            (trip.name || `Trip`).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTrips(filtered);
    }, [trips, searchTerm]);

    const handleTripClick = (trip) => {
        navigate('/trip-detail', { state: { trip } });
    };

    const handleCreateNewTrip = () => {
        navigate('/create-trip');
    };

    const handleDeleteTrip = (index) => {
        const updatedTrips = trips.filter((_, i) => i !== index);
        setTrips(updatedTrips);
        localStorage.setItem('travelPlans', JSON.stringify(updatedTrips));
    };

    const handleEditTrip = (trip, index) => {
        const newName = prompt('Enter new trip name:', trip.name || `Trip ${index + 1}`);
        if (newName) {
            const updatedTrips = [...trips];
            updatedTrips[index] = { ...trip, name: newName };
            setTrips(updatedTrips);
            localStorage.setItem('travelPlans', JSON.stringify(updatedTrips));
        }
    };

  return (
    <div className={`my-trips-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
                <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">✈️</span>
                    <span className="logo-text">TravelShare</span>
                </div>
            </div>

            <div className="header">
                <h2>My Trips</h2>
                <button className="create-trip-btn" onClick={handleCreateNewTrip}>
                    <span className="icon">+</span> Create New Trip
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            {filteredTrips.length === 0 ? (
                <div className="no-trips">
                    <p>No trips found. Start planning your adventure!</p>
                    <button className="create-trip-btn" onClick={handleCreateNewTrip}>
                        <span className="icon">+</span> Create Your First Trip
                    </button>
                </div>
            ) : (
                <ul className="trip-list">
                    {filteredTrips.map((trip, index) => (
                        <li key={index} className="trip-item">
                            <div className="trip-content" onClick={() => handleTripClick(trip)}>
                                <h3>{trip.name || `Trip ${index + 1}`}</h3>
                                <p>{trip.plans ? trip.plans.length : 0} Plans</p>
                                {trip.destination && <p className="destination">Destination: {trip.destination}</p>}
                                {trip.startDate && trip.endDate && (
                                    <p className="dates">
                                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="trip-actions">
                                <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditTrip(trip, index); }}>
                                    <span className="icon">✏️</span>
                                </button>
                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteTrip(index); }}>
                                    <span className="icon">🗑️</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyTrips;
