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
import NewUser from "./profile/newUser";
import UserContext from './UserContext'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.changeUserId = this.changeUserId.bind(this);
    this.state = {
      userId: null,
      changeUserId: this.changeUserId,
    }
  }

  changeUserId(newId) {
    this.setState({userId: newId})
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route path="/profile/new" component={NewUser} />
            <Route path="/profile">
              <Profile />
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
        </Router>
      </UserContext.Provider>
    );
  }
  
}

export const apiBaseURL = "http://127.0.0.1:8000/"
export const googleClientID = "438047756974-61bgeupaufbjh4cpdcmfeqt67fbqi2p6.apps.googleusercontent.com"