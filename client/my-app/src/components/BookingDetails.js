import React, { useEffect, useState } from 'react';

function BookingDetails({ bookingId, token }) {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the API URL
    const apiUrl = `/api/bookings/${bookingId}`;

    // Fetch booking details
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error('Booking not found');
        } else {
          throw new Error('Failed to fetch booking details');
        }
      })
      .then((data) => {
        setBookingDetails(data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [bookingId, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!bookingDetails) {
    return <p>No booking details available</p>;
  }

  return (
    <div>
      <h2>Booking Details</h2>
      <p>Booking ID: {bookingDetails.booking_id}</p>
      <p>Train ID: {bookingDetails.train_id}</p>
      <p>Train Name: {bookingDetails.train_name}</p>
      <p>User ID: {bookingDetails.user_id}</p>
      <p>No. of Seats: {bookingDetails.no_of_seats}</p>
      <p>Seat Numbers: {bookingDetails.seat_numbers.join(', ')}</p>
      <p>Arrival Time at Source: {bookingDetails.arrival_time_at_source}</p>
      <p>Arrival Time at Destination: {bookingDetails.arrival_time_at_destination}</p>
    </div>
  );
}

export default BookingDetails;
