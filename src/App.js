import React from 'react';
import Signup from './Signup';
import Login from './Login';
import Chat from './Chat';
import Logout from './Logout';
import { useUser } from 'reactfire';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';

//TODO: Add stats dashboard
function App() {
  const user = useUser();
  return (
      <div className="App">
        {
          user &&
            user.emailVerified &&
              <>
              <Router>
                  <Chat/>
              </Router>
              </>
        }
        {
          !user &&
          <>
            <Router>
            
              <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="*" component={NotFound} />
              </Switch>

            </Router>
          </>
        }
      </div>
  );
}

function NotFound() {
  return <p>Oh no! Doggo could not find the Page! Sad woof.</p>;
}

export default App;
