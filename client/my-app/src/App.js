import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import TrainAdd from './components/TrainAdd';
import TrainAvailability from './components/TrainAvailability';
import Booking from './components/BookTrainSeats';
import BookingDetails from './components/BookingDetails';

function App() {
  return (
    <Router>
      <div className="App">         
        <Switch>        
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/trainAdd" component={TrainAdd} />
          <Route path="/train-availability" component={TrainAvailability} />
          <Route path="/booking" component={Booking} />
          <Route path="/booking-details/:booking_id" component={BookingDetails} />
          <Route component={() => <div>404 Not Found</div>} />
        </Switch>
      </div>
    </Router>
  );
}
export default App;
