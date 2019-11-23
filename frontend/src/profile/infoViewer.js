import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import UserContext from '../UserContext'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { FormGroup } from '@material-ui/core';
// import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar';
// import {allTeams} from '../Logos/teams';

const styles = theme => ({
  bigBox: {
    backgroundColor: '#1c1c1c',
    height: '90vh',
  },
  containerBox: {
      width: '66vw',
      minWidth: 500,
      backgroundColor: theme.palette.background.default,
      margin: 'auto',
      padding: 30
  },
    generalPadding: {
        margin: 10,
    },
    profilePic: {
        width: 150,
        height: 150,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
    },
    picAlignedText: {
      marginLeft: 30,
    },
  });

class InfoViewer extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
          user: {},
          invalid: false,
        }
    }

    render() {
        const { classes } = this.props;
        return (
          <div className={classes.bigBox}>
            <Box className={classes.containerBox}>
              <FormGroup row={true}>
                <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb" alt="Profile-Pic" className={classes.profilePic}/>
                <div className={classes.picAlignedText}>
                  <Typography variant="h6">Words As Filler{this.state.user.name}</Typography>
                  <Typography variant="h6">Filler@email.com{this.state.user.email}</Typography>
                </div>
              </FormGroup>
              <Typography variant="h6">Credit Card Number:{this.state.user.cardNum}</Typography>
              <Button variant="contained" color="primary" onClick={this.editButton}>Edit</Button>
            </Box>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(InfoViewer)