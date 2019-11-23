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
  containerBox: {
      width: '66vw',
      minWidth: 500,
      backgroundColor: theme.palette.background.default,
      margin: 'auto',
      padding: 30
  },
    generalPadding: {
        margin: 20,
    },
    profilePic: {
        width: 150,
        height: 150,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
    },
    picAlignedText: {
      marginLeft: 50,
      height: 150,
    },
    alignText: {
      paddingTop: 30,
      height: 50,
      verticalAlign: 'bottom',
    },
  });

class InfoViewer extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
          user: this.props.user,
          invalid: false,
          edit: this.props.edit
        }
    }

    render() {
        const { classes } = this.props;
        return (
          <div className={classes.bigBox}>
            <Box className={classes.containerBox}>
              <FormGroup row={true} className={classes.generalPadding}>
                <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb" alt="Profile-Pic" className={classes.profilePic}/>
                <div className={classes.picAlignedText}>
                  <Typography variant="h4" className={classes.alignText}>
                    Words As Filler{this.state.user.name}
                  </Typography>
                  <Typography variant="h4" className={classes.alignText}>
                    Filler@email.com{this.state.user.email}
                  </Typography>
                </div>
              </FormGroup>
              <Typography variant="h5" className={classes.generalPadding}>
                Bio: {this.state.user.bio}
              </Typography>
              <Typography variant="h5" className={classes.generalPadding}>
                Favorite Teams:
              </Typography>
              <br/>

              <Typography variant="h4" className={classes.generalPadding}>
                {'\nPayment Information'}
              </Typography>
              <Typography variant="h5" className={classes.generalPadding}>
                Credit Card Number: {this.state.user.cardNum}
              </Typography>
              <Typography variant="h5" className={classes.generalPadding}>
                Payment Name: {this.state.user.cardName}
              </Typography>
              <Typography variant="h5" className={classes.generalPadding}>
                Billing Address:
              </Typography>
              <Typography variant="h6">{this.state.user.billingAddress1}</Typography>
              <Typography variant="h6">{this.state.user.billingAddress2}</Typography>
              <Typography variant="h6">{this.state.user.billingCity + ', ' + this.state.user.billingState + ' ' + this.state.user.billingZip}</Typography>
              <Button variant="contained" color="primary" onClick={this.state.edit}  className={classes.generalPadding}>Edit</Button>
            </Box>
          </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(InfoViewer)