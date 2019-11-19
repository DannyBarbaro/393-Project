import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom'

import { apiBaseURL, googleClientID } from '../../App.js'
import UserContext from '../../UserContext'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  fail: {
    color: 'red',
  }
});

class HomeTopBar extends Component {
  static contextType = UserContext

  constructor(props) {
    super(props);
    this.state = {
      failed: false,
      newUser: false,
      userId: null,
    }
    this.onloginFail = this.onloginFail.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onloginFail() {
    this.setState({failed: true});
  }

  onLoginSuccess(resp) {
    let url = new URL('login', apiBaseURL);
    url.search = new URLSearchParams({email: resp.profileObj.email}).toString();
    this.userEmail = resp.profileObj.email;
    fetch(url)
    .then(resp => resp.json())
    .then(resp => {
      if (resp.newUser) {
        this.setState({newUser: true});
      } else {
        this.setState({userId: resp.userId});
        this.context.changeUserId(resp.userId);
      }
    });
  }

  render() {
    const { classes } = this.props;
    if (this.state.newUser) {
      return <Redirect to={{
        pathname: '/profile/new',
        state: {email: this.userEmail}
       }} />
    }
    return(
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            SeatSwap
          </Typography>
          {this.state.failed &&
          <Typography variant="body1" className={classes.fail}>
            Authentication Failed
          </Typography>}
          <GoogleLogin
            clientId={googleClientID}
            buttonText="Login with Google"
            onSuccess={this.onLoginSuccess}
            onFailure={this.onloginFail}
            cookiePolicy={'single_host_origin'}
          />
          <Button color="secondary">Sign Up</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomeTopBar)