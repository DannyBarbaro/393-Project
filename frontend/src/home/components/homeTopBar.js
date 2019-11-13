import React, { Component } from 'react';
import { withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

class HomeTopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  //functions

  render() {
    const { classes } = this.props;
    return(
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            SeatSwap
          </Typography>
          <Button color="default">Login</Button>
          <Button color="secondary">Sign Up</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomeTopBar)