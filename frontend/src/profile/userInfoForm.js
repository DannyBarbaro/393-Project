import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import UserContext from '../UserContext'
import { apiBaseURL } from "../App";
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
    },
    chip: {
        margin: 3,
    },
    teamIcon: {
        width: '100%',
    },
    errorMessage: {
        color: '#f54235',
    },
  });

class UserInfoForm extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        if (props.newUser) {
            this.state = {
                email: props.user.email,
                name: '',
                bio: '',
                profilePic: '',
                cardNum: '',
                cardSecurity: '',
                cardName: '',
                billingAddress1: '',
                billingAddress2: '',
                billingCity: '',
                billingState: '',
                billingZip: '',
                imageError: '',
                errorMessage: false,
            }
        } else {
            this.state = {
                email: props.user.email,
                name: props.user.name,
                bio: props.user.bio,
                profilePic: props.user.profilePic,
                cardNum: props.user.cardNum,
                cardSecurity: props.user.cardSecurity,
                cardName: props.user.cardName,
                billingAddress1: props.user.billingAddress1,
                billingAddress2: props.user.billingAddress2,
                billingCity: props.user.billingCity,
                billingState: props.user.billingState,
                billingZip: props.user.billingZip,
                imageError: '',
                errorMessage: false,
            };
        }
        this.callback = props.callback;
        this.cancelCallback = props.cancelCallback;
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.selectFile = this.selectFile.bind(this);
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        if(this.checkAll()) {
            this.setState({errorMessage: true});
        } else {
            this.callback(this.state)
        }
    }

    fileToBase64(file){
        return new Promise(resolve => {
            var reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });
      };

    selectFile(event) {
        var files = event.target.files
        var file = ''
        const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (files.length > 1) {
            this.setState({imageError: 'Only one file can be uploaded'});
            return
        } else {
            file = files[0]
        }
        if (types.every(type => file.type !== type)) {
            this.setState({imageError: `'${file.type}' is not a supported format`});
        } else if (file.size > 2000000) {
            this.setState({imageError: `'${file.type}' is too large (Max 2MB) Please pick a smaller file`});
        } else {
            this.fileToBase64(file).then(result => {
                let url = new URL('profilePic', apiBaseURL);
                url.search = new URLSearchParams({userId: this.context.userId}).toString();
                let options = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: "POST",
                    body: JSON.stringify({'profilePic': result})
                }
                fetch(url, options)
                this.setState({profilePic: result});
            });
            
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
                        name="name"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={this.requiredCheck(this.state.name)}
                        helperText={this.requiredCheck(this.state.name) ? 'Username Required' : ''}/>
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
                        name="bio"
                        onChange={this.onChange}
                        value={this.state.bio}
                        error={this.bioCheck(this.state.name)}
                        helperText={this.bioCheck(this.state.name) ? 'Slow down there! (280 character limit)' : ''}/>
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
                    <input type="file" style={{ display: "none" }} onChange={this.selectFile}/>
                    </Button>
                    <br/>
                    <Typography variant="h6" className={classes.errorMessage}>
                        {this.state.imageError}
                    </Typography>
                    <br/>
                    <Avatar src={`${this.state.profilePic}`} alt="" className={classes.profilePic}/>
                    <br/>
                    <Typography variant="h6" className={classes.generalPadding}>
                        Choose Your Favorite Teams!
                    </Typography>
                    <br/>
                    { allTeams.leagues.map(function(league, index){
                        return(<div key={index}>
                            <Typography variant="body1">
                                {league.name}
                            </Typography>
                            <br/>
                            { league.teams.map(function(team, index){
                                return <Chip
                                    key={index}
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
                        name="cardNum"
                        onChange={this.onChange}
                        value={this.state.cardNum}
                        error={this.cardCheck()}
                        helperText={this.cardCheck() ? 'Please Enter a Valid Card Number' : ''}/>
                    <TextField
                        className={classes.xsField}
                        label="CVV"
                        margin="normal"
                        variant="outlined"
                        name="cardSecurity"
                        onChange={this.onChange}
                        value={this.state.cardSecurity}
                        error={this.securityCheck()}
                        helperText={this.securityCheck() ? 'Invalid CVV' : ''}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Name on Card"
                        margin="normal"
                        variant="outlined"
                        name="cardName"
                        onChange={this.onChange}
                        value={this.state.cardName}
                        error={this.requiredCheck(this.state.cardName)}
                        helperText={this.requiredCheck(this.state.cardName) ? 'Card Name Required' : ''}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Billing Adress Line 1"
                        margin="normal"
                        variant="outlined"
                        name="billingAddress1"
                        onChange={this.onChange}
                        value={this.state.billingAddress1}
                        error={this.requiredCheck(this.state.billingAddress1)}
                        helperText={this.requiredCheck(this.state.billingAddress1) ? 'Adress Required' : ''}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="Billing Adress Line 2"
                        margin="normal"
                        variant="outlined"
                        name="billingAddress2"
                        onChange={this.onChange}
                        value={this.state.billingAddress2}/>
                    <br/>
                    <TextField
                        className={classes.mField}
                        label="City"
                        margin="normal"
                        variant="outlined"
                        name="billingCity"
                        onChange={this.onChange}
                        value={this.state.billingCity}
                        error={this.requiredCheck(this.state.billingCity)}
                        helperText={this.requiredCheck(this.state.billingCity) ? 'City Required' : ''}/>
                    <TextField
                        className={classes.xsField}
                        label="State"
                        margin="normal"
                        variant="outlined"
                        name="billingState"
                        onChange={this.onChange}
                        value={this.state.billingState}
                        error={this.requiredCheck(this.state.billingState)}
                        helperText={this.requiredCheck(this.state.billingState) ? 'State Required' : ''}/>
                    <TextField
                        className={classes.xsField}
                        label="Zip Code"
                        margin="normal"
                        variant="outlined"
                        name="billingZip"
                        onChange={this.onChange}
                        value={this.state.billingZip}
                        error={this.requiredCheck(this.state.billingZip)}
                        helperText={this.requiredCheck(this.state.billingZip) ? 'Zip Required' : ''}/>
                </Box>
                <Box className={classes.containerBox}>
                    { this.state.errorMessage &&
                        <Typography variant="h6" className={classes.errorMessage}>Please make sure you filled everything out correctly!</Typography>
                    }
                    { !this.state.isNew &&
                        <Button variant="contained" color="secondary" className={classes.generalPadding} onClick={this.cancelCallback}>
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


    requiredCheck(param) {return !param || param.length === 0}
    bioCheck() {return this.state.bio && this.state.bio.length > 280}
    cardCheck() {return !this.state.cardNum || this.state.cardNum.length !== 16 || this.state.cardNum.match(/[\d]/g).length !== 16}
    securityCheck() {return !this.state.cardSecurity || this.state.cardSecurity.length !== 3 || this.state.cardSecurity.match(/[\d]/g).length !== 3}
    checkAll(){
        return this.bioCheck() || this.cardCheck() || this.securityCheck() || this.requiredCheck(this.state.name) ||
            this.requiredCheck(this.state.cardName) || this.requiredCheck(this.state.billingAddress1) ||
            this.requiredCheck(this.state.billingCity) || this.requiredCheck(this.state.billingState) ||
            this.requiredCheck(this.state.billingZip)

    }
}

export default withStyles(styles, { withTheme: true })(UserInfoForm)