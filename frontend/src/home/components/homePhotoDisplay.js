import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from '../../stadium.jpg';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  imgContainer: {
    backgroundImage: `url(${Image})`,
    height: '75vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDisplay: {
    padding: 30,
    width: '50vw',
    minWidth: 325,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  title: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  description: {
    textAlign: 'center',
  }
});

class HomePhotoDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  //functions

  render() {
    const { classes } = this.props;
    return(
      <Box className={classes.imgContainer}>
        <Paper className={classes.centerDisplay}>
          <Typography variant="h3" className={classes.title}>
            Welcome to SeatSwap!
          </Typography>
          <Typography variant="h5" className={classes.description}>
            A brand new way to watch the game.
          </Typography>
        </Paper>
      </Box>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomePhotoDisplay)