import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
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
      <Box className={classes.imgContainer}></Box>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomePhotoDisplay)