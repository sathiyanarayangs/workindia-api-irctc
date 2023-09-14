import React, { useState } from 'react';

const BookTrainSeats = ({ trainId, userId, onBookingSuccess }) => {
  const [noOfSeats, setNoOfSeats] = useState(1);

  const handleNoOfSeatsChange = (e) => {
    setNoOfSeats(parseInt(e.target.value, 10));
  };

  const handleBookSeats = async () => {
    // Make an HTTP POST request to book train seats
    try {
      const response = await fetch(`/api/trains/${trainId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          no_of_seats: noOfSeats,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        onBookingSuccess(data);
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred during booking:', error);
    }
  };

  return (
    <div>
      <h2>Book Train Seats</h2>
      <div>
        <label>No. of Seats:</label>
        <input type="number" value={noOfSeats} onChange={handleNoOfSeatsChange} />
      </div>
      <div>
        <button onClick={handleBookSeats}>Book Seats</button>
      </div>
    </div>
  );
};

export default BookTrainSeats;