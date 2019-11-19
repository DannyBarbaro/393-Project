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

//const [anchorEl, setAnchorEl] = React.useState(null);

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageName: props.pageName,
      anchorEl: null,
      setAnchorEl: null 
    }
    this.handleMenuClick= this.handleMenuClick.bind(this);
  }

  //functions
  handleMenuClick(e) {
    this.state.ancherEl
          ? this.setState({ anchorEl: null })
          : this.setState({ anchorEl: e.currentTarget });
  };

  handleMenuClose() {
    //this.setState({ anchorEl: null })
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return(
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton}>
            <MenuIcon  onClick={this.handleMenuClick}/>
            <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}
            TransitionComponent={Fade}>
              <MenuItem onClick={this.handleMenuClose}
                containerElement={<Link to="/profile" />}>
                Profile
              </MenuItem>
              <MenuItem onClick={this.handleMenuClose}
                containerElement={<Link to="/profile" />}>
                Search
              </MenuItem>
              <MenuItem onClick={this.handleMenuClose}
                containerElement={<Link to="/profile" />}>
                My Groups
              </MenuItem>
            </Menu>
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            {this.state.pageName}
          </Typography>
          <Button>Logout</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MenuBar)