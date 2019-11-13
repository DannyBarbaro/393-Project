import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CopyrightIcon from '@material-ui/icons/Copyright';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  container: {
    marginTop: 60,
    marginBottom: 20,
    display: 'flex',
    color: 'lightblue',
  },
});

class HomeFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  //functions

  render() {
    const { classes } = this.props;
    return(
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item>
            <CopyrightIcon style={{fontSize: 'small'}}/> 2019
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Software Engineering Project. Fall 2019. Authors: D. Barbaro, J. Levy, C. Gaffney
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomeFooter)