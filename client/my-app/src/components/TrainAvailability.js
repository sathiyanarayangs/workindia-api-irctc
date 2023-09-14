import React, { useState, useEffect } from 'react';

const TrainAvailability = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [availabilityData, setAvailabilityData] = useState([]);

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleCheckAvailability = async () => {
    // Make an HTTP GET request to your train availability API endpoint
    try {
      const response = await fetch(`/api/trains/availability?source=${source}&destination=${destination}`);
      if (response.status === 200) {
        const data = await response.json();
        setAvailabilityData(data);
      } else {
        const errorData = await response.json();
        console.error('Train availability check failed:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred during train availability check:', error);
    }
  };

  useEffect(() => {
    // You can load the available source and destination options from your server here if needed
  }, []);

  return (
    <div>
      <h2>Check Train Availability</h2>
      <div>
        <label>Source:</label>
        <input type="text" value={source} onChange={handleSourceChange} />
      </div>
      <div>
        <label>Destination:</label>
        <input type="text" value={destination} onChange={handleDestinationChange} />
      </div>
      <div>
        <button onClick={handleCheckAvailability}>Check Availability</button>
      </div>
      <div>
        {availabilityData.length > 0 && (
          <div>
            <h3>Available Trains:</h3>
            <ul>
              {availabilityData.map((train) => (
                <li key={train.train_id}>
                  Train ID: {train.train_id}, Train Name: {train.train_name}, Available Seats: {train.available_seats}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainAvailability;