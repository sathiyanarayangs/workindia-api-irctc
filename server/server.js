const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = '55555';

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, secretKey, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/signup', (req, res) => {
	const { username, password, email } = req.body;
  
	const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
	db.query(checkUserQuery, [username], (checkErr, checkResults) => {
	  if (checkErr) {
		return res.status(500).json({ message: 'Internal server error' });
	  }
  
	  if (checkResults.length > 0) {
		return res.status(409).json({ message: 'Username already exists' });
	  }
  
	  // Hash the user's password before storing it in the database
	  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
		if (hashErr) {
		  return res.status(500).json({ message: 'Internal server error' });
		}
  
		const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
		db.query(insertUserQuery, [username, hashedPassword, email], (insertErr, insertResults) => {
		  if (insertErr) {
			return res.status(500).json({ message: 'Internal server error' });
		  }
  
		  const userId = insertResults.insertId;
		  const token = generateToken(userId, 'User');
  
		  return res.status(200).json({
			status: 'Account successfully created',
			status_code: 200,
			user_id: userId,
			access_token: token,
		  });
		});
	  });
	});
});

app.post('/api/login', (req, res) => {
	const { username, password } = req.body;
  
	const query = 'SELECT * FROM users WHERE username = ?';
  
	db.query(query, [username], (err, results) => {
	  if (err) {
		return res.status(500).json({ message: 'Internal server error' });
	  }
  
	  if (results.length === 0) {
		return res.status(401).json({ message: 'Incorrect username or password' });
	  }
  
	  const user = results[0];
  
	  // Compare the entered plain text password with the hashed password from the database
	  bcrypt.compare(password, user.password, (compareErr, isMatch) => {
		if (compareErr) {
		  return res.status(500).json({ message: 'Internal server error' });
		}
  
		if (isMatch) {
		  const token = generateToken(user.user_id, user.role);
  
		  return res.status(200).json({
			status: 'Login successful',
			status_code: 200,
			user_id: user.user_id,
			access_token: token,
		  });
		} else {
		  return res.status(401).json({ message: 'Incorrect username or password' });
		}
	  });
	});
});

app.post('/api/trains/create', (req, res) => {
  const {
    train_name,
    source,
    destination,
    seat_capacity,
    arrival_time_at_source,
    arrival_time_at_destination,
  } = req.body;

  const insertTrainQuery = `
    INSERT INTO trains (train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertTrainQuery,
    [train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      const trainId = results.insertId;

      return res.status(200).json({
        message: 'Train added successfully',
        train_id: trainId,
      });
    }
  );
});

app.get('/api/trains/availability', (req, res) => {
  const { source, destination } = req.query;

  const getAvailabilityQuery = `
    SELECT train_id, train_name, available_seats
    FROM trains
    WHERE source = ? AND destination = ?
  `;

  db.query(getAvailabilityQuery, [source, destination], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const availabilityData = results.map((result) => ({
      train_id: result.train_id,
      train_name: result.train_name,
      available_seats: result.available_seats,
    }));

    res.status(200).json(availabilityData);
  });
});

app.post('/api/trains/:train_id/book', authenticate, (req, res) => {
  const { train_id } = req.params;
  const { user_id, no_of_seats } = req.body;

  const checkAvailabilityQuery = `
    SELECT seat_capacity - COUNT(*) AS available_seats
    FROM bookings
    WHERE train_id = ?;
  `;

  db.query(checkAvailabilityQuery, [train_id], (availabilityErr, availabilityResults) => {
    if (availabilityErr) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const availableSeats = availabilityResults[0].available_seats;

    if (availableSeats < no_of_seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const bookingId = Math.floor(Math.random() * 1000000);

    const insertBookingQuery = `
      INSERT INTO bookings (booking_id, train_id, user_id, no_of_seats)
      VALUES (?, ?, ?, ?);
    `;

    db.query(
      insertBookingQuery,
      [bookingId, train_id, user_id, no_of_seats],
      (bookingErr, bookingResults) => {
        if (bookingErr) {
          return res.status(500).json({ message: 'Internal server error' });
        }

        const updateAvailabilityQuery = `
          UPDATE bookings
          SET seat_capacity = seat_capacity - ?
          WHERE train_id = ?;
        `;

        db.query(
          updateAvailabilityQuery,
          [no_of_seats, train_id],
          (updateErr, updateResults) => {
            if (updateErr) {
              return res.status(500).json({ message: 'Internal server error' });
            }

            const bookingResponse = {
              message: 'Seat booked successfully',
              booking_id: bookingId,
              seat_numbers: generateSeatNumbers(no_of_seats),
            };

            res.status(200).json(bookingResponse);
          }
        );
      }
    );
  });
});

function generateSeatNumbers(no_of_seats) {
  const seatNumbers = [];
  for (let i = 1; i <= no_of_seats; i++) {
    seatNumbers.push(i);
  }
  return seatNumbers;
}

app.get('/api/bookings/:booking_id', authenticate, (req, res) => {
	const { booking_id } = req.params;
  
	// Query the database to get booking details by booking_id
	const getBookingQuery = `
	  SELECT
		b.booking_id,
		b.train_id,
		t.train_name,
		b.user_id,
		b.no_of_seats,
		b.seat_numbers,
		t.arrival_time_at_source,
		t.arrival_time_at_destination
	  FROM bookings AS b
	  JOIN trains AS t ON b.train_id = t.train_id
	  WHERE b.booking_id = ?;
	`;
  
	db.query(getBookingQuery, [booking_id], (err, results) => {
	  if (err) {
		return res.status(500).json({ message: 'Internal server error' });
	  }
  
	  if (results.length === 0) {
		return res.status(404).json({ message: 'Booking not found' });
	  }
  
	  const bookingDetails = results[0];
  
	  res.status(200).json(bookingDetails);
	});
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});