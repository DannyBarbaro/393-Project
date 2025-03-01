import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import { withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withCookies} from 'react-cookie';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 15,
  },
  title: {
    flexGrow: 1,
  },
});

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageName: props.pageName,
      anchorEl: null,
      logout: false,
    }
    this.cookies = props.cookies;
    this.handleMenuClick= this.handleMenuClick.bind(this);
    this.handleMenuClose= this.handleMenuClose.bind(this);
    this.onLogout = this.onLogout.bind(this)
  }

  //functions
  handleMenuClick(e) {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  onLogout() {
    this.cookies.remove('userId', {path: '/'})
  }

  render() {
    const { classes } = this.props;
    return(
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton}>
            <MenuIcon onClick={this.handleMenuClick}/>
            <Menu
              anchorEl={this.state.anchorEl}
              keepMounted
              open={!!this.state.anchorEl}
              onClose={this.handleMenuClose}
              TransitionComponent={Fade}>
              <MenuItem onClick={this.handleMenuClose} component={Link} to="/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={this.handleMenuClose} component={Link} to="/search">
                Search
              </MenuItem>
              <MenuItem onClick={this.handleMenuClose} component={Link} to="/groups">
                My Groups
              </MenuItem>
            </Menu>
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            {this.state.pageName}
          </Typography>
          <Button onClick={this.onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withCookies(withStyles(styles, { withTheme: true })(MenuBar))