import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Groups from "./groups/groups";
import Profile from "./profile/profile";
import Home from "./home/home";
import Search from "./search/search";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/groups">My Groups</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/profile">
            <Profile user={{name:"Josh", email:"e@mail.com", cardNum:"1"}}/>
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/groups">
            <Groups user={{name:"Josh", email:"e@mail.com", cardNum:"1"}}/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export const apiBaseURL = "http://127.0.0.1:8000/"