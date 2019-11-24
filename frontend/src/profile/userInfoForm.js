import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {apiBaseURL} from '../App';
import UserContext from '../UserContext'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import {allTeams} from '../Logos/teams';

const styles = theme => ({
    bigBox: {
        backgroundColor: '#1c1c1c',
    },
    containerBox: {
        width: '66vw',
        minWidth: 500,
        backgroundColor: theme.palette.background.default,
        margin: 'auto',
        padding: 30
    },
    xsField: {
        margin: 10,
        width: 100,
    },
    sField: {
        margin: 10,
        width: 200,
    },
    mField: {
        margin: 10,
        width: 300,
    },
    lField: {
        margin: 10,
        width: 400,
    },
    generalPadding: {
        margin: 10,
    },
    profilePic: {
        width: 200,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
    },
    chip: {
        margin: 3,
    },
    teamIcon: {
        width: '100%',
        
    },
  });

class UserInfoForm extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        if (props.newUser) {
            this.state = {
                email: props.user.email,
                isNew: true,
                callback: props.callback,
            }
        } else {
            this.state = {
                email: props.user.email,
                name: props.user.name,
                bio: props.user.bio,
                cardNum: props.user.cardNum,
                cardSecurity: props.user.cardSecurity,
                cardName: props.user.cardName,
                billingAdress1: props.user.billingAdress1,
                billingAdress2: props.user.billingAdress2,
                billingCity: props.user.billingCity,
                billingState: props.user.billingState,
                billingZip: props.user.billingZip,
                isNew: false,
                callback: props.callback,
                cancel: props.canceledCallback,
            };
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.processCallback = this.processCallback.bind(this);
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({user: this.state})
        }
        let url;
        if (this.state.isNew) {
            url = new URL('addUser', apiBaseURL);
        } else {
            url = new URL('updateUser', apiBaseURL);
        }
        fetch(url, options)
        .then(resp => resp.json())
        .then(resp => {
            if (!!resp.userId) {
                this.context.changeUserId(resp.userId)
            }
            this.processCallback()
        });
        e.preventDefault()
    }

    processCallback() {
        if (!!this.state.callback) {
            this.state.callback(this.state);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bigBox}>
                <Box className={classes.containerBox}>
                    <Typography variant="h4">Personal Information</Typography>
                    <TextField
                        className={classes.sField}
                        label="Username"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}/>
                    <TextField
                        disabled
                        className={classes.sField}
                        label="Email"
                        margin="normal"
                        variant="outlined"
                        value={this.state.email}/>
                    <br/>
                    <TextField
                        multiline
                        className={classes.lField}
                        label="Bio"
                        margin="normal"
                        variant="outlined"
                        value={this.state.bio}/>
                    <br/>
                    <Typography variant="body1" className={classes.generalPadding}>
                        { this.state.bio ? this.state.bio.length : 0 }/280
                    </Typography>
                    <br/>
                    <Button
                        variant="contained"
                        component="label"
                        className={classes.generalPadding}>
                        Upload Profile Pic
                        <input type="file" style={{ display: "none" }}/>
                    </Button>
                    <br/>
                    <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb" alt="Profile-Pic" className={classes.profilePic}/>
                    <br/>
                    <Typography variant="h6" className={classes.generalPadding}>
                        Choose Your Favorite Teams!
                    </Typography>
                    <br/>
                    { allTeams.leagues.map(function(league){
                        return(<div>
                            <Typography variant="body1">
                                {league.name}
                            </Typography>
                            <br/>
                            { league.teams.map(function(team){
                                return <Chip
                                    label={team}
                                    className={classes.chip}
                                    avatar={
                                        <Avatar
                                            src={require(`../Logos/${league.name}/${team.replace(" ", "_")}.gif`)} 
                                            className={classes.teamIcon}/>} />
                            })
                            }
                        </div>)
                    })
                        
                    }
                </Box>
                <Box className={classes.containerBox}>
                    <Typography variant="h4">Payment Information</Typography>
                    <TextField
                        className={classes.mField}
                        label="Credit Card Number"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.cardNum}/>
                    <TextField
                        className={classes.xsField}
                        label="CVV"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.cardSecurity}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Name on Card"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.cardName}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Billing Adress Line 1"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.billingAdress1}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Billing Adress Line 2"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.billingAdress2}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="City"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.billingCity}/>
                    <TextField
                        className={classes.xsField}
                        label="State"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.billingState}/>
                    <TextField
                        className={classes.xsField}
                        label="Zip Code"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.billingZip}/>
                </Box>
                <Box className={classes.containerBox}>
                    { !this.state.isNew &&
                        <Button variant="contained" color="secondary" className={classes.generalPadding}  onClick={this.state.cancel}>
                            Cancel
                        </Button>
                    }
                    <Button variant="contained" className={classes.generalPadding} onClick={this.onSubmit}>
                        Submit
                    </Button>
                </Box>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(UserInfoForm)