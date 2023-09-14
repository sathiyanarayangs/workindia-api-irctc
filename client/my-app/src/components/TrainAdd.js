import React, { useState } from 'react';

const TrainAdd = () => {
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('');
  const [arrivalTimeAtSource, setArrivalTimeAtSource] = useState('');
  const [arrivalTimeAtDestination, setArrivalTimeAtDestination] = useState('');

  const handleTrainNameChange = (e) => {
    setTrainName(e.target.value);
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSeatCapacityChange = (e) => {
    setSeatCapacity(e.target.value);
  };

  const handleArrivalTimeAtSourceChange = (e) => {
    setArrivalTimeAtSource(e.target.value);
  };

  const handleArrivalTimeAtDestinationChange = (e) => {
    setArrivalTimeAtDestination(e.target.value);
  };

  const handleAddTrain = async () => {
    // Make an HTTP POST request to your create train API endpoint
    try {
      const response = await fetch('/api/trains/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          train_name: trainName,
          source,
          destination,
          seat_capacity,
          arrival_time_at_source,
          arrival_time_at_destination,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Train added successfully:', data);
        // You can redirect the user or show a success message here
      } else {
        const errorData = await response.json();
        console.error('Train addition failed:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred during train addition:', error);
    }
  };

  return (
    <div>
      <h2>Add Train</h2>
      <div>
        <label>Train Name:</label>
        <input type="text" value={trainName} onChange={handleTrainNameChange} />
      </div>
      <div>
        <label>Source:</label>
        <input type="text" value={source} onChange={handleSourceChange} />
      </div>
      <div>
        <label>Destination:</label>
        <input type="text" value={destination} onChange={handleDestinationChange} />
      </div>
      <div>
        <label>Seat Capacity:</label>
        <input type="text" value={seatCapacity} onChange={handleSeatCapacityChange} />
      </div>
      <div>
        <label>Arrival Time at Source:</label>
        <input type="text" value={arrivalTimeAtSource} onChange={handleArrivalTimeAtSourceChange} />
      </div>
      <div>
        <label>Arrival Time at Destination:</label>
        <input type="text" value={arrivalTimeAtDestination} onChange={handleArrivalTimeAtDestinationChange} />
      </div>
      <div>
        <button onClick={handleAddTrain}>Add Train</button>
      </div>
    </div>
  );
};

export default TrainAdd;
