import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Groups from "./groups/groups";
import Profile from "./profile/profile";
import Home from "./home/home";
import Search from "./search/search";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
    }
    this.switchUser = this.switchUser.bind(this);
  }

  switchUser(id) {
    this.setState({userID: id});
  }

  render() {
    return (
      <Router>
          {/* <nav>
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
          </nav> */}
  
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
              <Home updater={this.switchUser}/>
            </Route>
          </Switch>
      </Router>
    );
  }
  
}

export const apiBaseURL = "http://127.0.0.1:8000/"
export const googleClientID = "438047756974-61bgeupaufbjh4cpdcmfeqt67fbqi2p6.apps.googleusercontent.com"