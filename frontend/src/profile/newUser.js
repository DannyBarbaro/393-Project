import React, { Component } from 'react';
import UserInfoForm from './userInfoForm';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    description: {
        textAlign: 'center',
        background: '#1c1c1c',
        padding: 20,
    },
});

class NewUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            completed: false
        }
        if (!!this.props.location) {
            this.userEmail = this.props.location.state.email;
        }
    }

    render() {
        const { classes } = this.props
        if (this.state.invalid) {
            return <Redirect to='/home' />
        }
        if (this.state.completed) {
            return <Redirect to='/profile' />
        }
        return (
            <div>
                 <AppBar position="sticky">
                    <Toolbar>
                        <Typography variant="h5" className={classes.title}>
                            Welcome to SeatSwap!
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography variant="h6" className={classes.description}>
                    Please enter your information so we can create your account.
                </Typography>
                <UserInfoForm user={{email: this.userEmail}} newUser
                    callback={() => this.setState({completed: true})}/>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(NewUser)