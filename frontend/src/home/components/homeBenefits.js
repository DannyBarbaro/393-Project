import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import SportsFootballRoundedIcon from '@material-ui/icons/SportsFootballRounded';

const styles = theme => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  icon: {
    marginTop: 10,
    fontSize: 72,
  },
  title: {
    textAlign: 'center',
    fontSize: 'xx-large',
  },
  body: {
    fontSize: 'large',
    marginBottom: 20,
  },
});

class HomeBenefits extends Component {
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
          <Grid item xs={12} md={4}>
            <Paper className={classes.item}>
              <SportsFootballRoundedIcon className={classes.icon}/>
              <Typography className={classes.title}>
                Fun
              </Typography>
              <Typography className={classes.body}>
                {'Say goodbye to those seats in the nosebleed section! SeatSwap gives '}
                {'you the oppurtunity to watch the biggest games from the best seats in the house.'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.item}>
            <PeopleAltRoundedIcon className={classes.icon}/>
              <Typography className={classes.title}>
                Friends
              </Typography>
              <Typography className={classes.body}>
                {'Don\'t worry about going alone. SeatSwap allows you to meet fans of your team '}
                {'and give you the experience of watching the game with your friends.'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.item}>
              <AttachMoneyRoundedIcon className={classes.icon}/>
              <Typography className={classes.title}>
                Affordable
              </Typography>
              <Typography className={classes.body}>
                {'The best seats don\'t need to have then highest price tag. '}
                {'SeatSwap provides the best viewing experience that won\'t break the bank.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomeBenefits)