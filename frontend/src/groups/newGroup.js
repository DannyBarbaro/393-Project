import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/';
import GroupInfoForm from './groupInfoForm';
import { apiBaseURL } from '../App';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withCookies} from 'react-cookie';

const styles = theme => ({
    description: {
        textAlign: 'center',
        padding: 20,
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 15,
    },
});
class NewGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            canceled: false,
            groupId: null,
        }
        this.cookies = this.props.cookies;
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(newGroup) {
        let url = new URL('createGroup', apiBaseURL);
        newGroup.ownerId = this.cookies.get('userId');
        newGroup.members = [this.cookies.get('userId')];
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({group: newGroup})
        }
        fetch(url, options)
        .then(resp => resp.json())
        .then(resp => this.setState({finished: true, groupId: resp.groupId}))
    }

    render() {
        if (!this.cookies.get('userId')) {
            return <Redirect to='/' />
        }
        const { classes } = this.props
        if (this.state.finished) {
            return <Redirect to={'/groups/' + this.state.groupId} />
        } else if (this.state.canceled) {
            return <Redirect to={'/groups'} />
        }

        return (
            <div>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.backButton}
                            onClick={() => this.setState({canceled: true})}>
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            Create A New Group
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography variant="h6" className={classes.description}>
                    Please Enter the Following Information for Your Group
                </Typography>
                <GroupInfoForm submit={this.onSubmit}/>
            </div>
        );
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(NewGroup))