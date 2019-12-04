import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core';
import Scheduler from './scheduler';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    closeButton: {
        marginRight: 15,
    },
    headerTitle: {
        flexGrow: 1,
    },
    
    title: {
        paddingTop: '10%',
        textAlign: 'center',
    },
    value: {
        textAlign: 'center',
    },
    inLineButton: {
        marginTop: 5,
        width: '100%'
    },
    groupPaper: {
        marginLeft: 5,
        marginRight: 5,
        minHeight: 120,
        justifyContent: 'center'
    },
    bottomButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
    }
});

class ShowGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            memberNames: [],
            ownerName: '',
            eventName: '',
            visibility: '',
        }
        this.cookies = this.props.cookies;
        this.groupId = this.props.groupId;
        this.onJoin = this.onJoin.bind(this);
        this.openMessages = this.openMessages.bind(this);
    }

    componentDidMount() {
        let url = new URL('/groups', apiBaseURL);
        url.search = new URLSearchParams({id: this.groupId}).toString()
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            let url = new URL('/users', apiBaseURL)
            url.search = 'id=' + resp.group.members.reduce((total, id) => total + '&id=' + id)
            fetch(url)
            .then(resp => resp.json())
            .then(resp => this.setState({memberNames: resp.usernames}))

            url.search = new URLSearchParams({id: resp.group.ownerId}).toString()
            fetch(url)
            .then(resp => resp.json())
            .then(resp => this.setState({ownerName: resp.usernames[0]}))

            //TODO get name of event
            this.setState({groupName: resp.group.name, visibility: resp.group.visibility})
        })
    }

    onJoin(e) {
        let target = e.target;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userId: this.cookies.get('userId'), groupId: target.name })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.name}),
                  err => console.log(err))
    }

    openMessages(e) {
        console.log("HAHAHA You wish")
    }
    
    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar color="secondary" position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.closeButton}
                            component={Link}
                            to='/groups'>
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h5" className={classes.headerTitle}>
                            Group Information
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={0}>
                    <Grid item md={9}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} md={4}>
                                <Paper className={classes.groupPaper}>
                                    <Typography variant="h6" className={classes.title}>Group Name:</Typography>
                                    <Typography variant="body1" className={classes.value}>{this.state.groupName}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper className={classes.groupPaper}>
                                    <Typography variant="h6" className={classes.title}>Owner Name:</Typography>
                                    <Typography variant="body1" className={classes.value}>{this.state.ownerName}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper className={classes.groupPaper}>
                                    <Typography variant="h6" className={classes.title}>Group Visibility:</Typography>
                                        <Typography variant="body1" className={classes.value}>{this.state.visibility === 'private' ? 'Private' : 'Public'}</Typography>
                                        {this.notAMember() &&
                                            <Button
                                                size ="small"
                                                variant="contained"
                                                name={this.groupId}
                                                className={classes.inLineButton}
                                                onClick={this.onJoin}>
                                                Join
                                            </Button>
                                        }
                                </Paper>
                            </Grid>
                        </Grid>
                        <Scheduler></Scheduler>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Group Members:</Typography>
                            {this.state.memberNames.map((name, index) => (
                                <Typography variant="body1" key={index} className={classes.value}>{name}</Typography>))
                            }
                        </Paper>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.bottomButton}
                            onClick={this.openMessages}>Open Messages</Button>
                    </Grid>
                </Grid>

                <ScheduleEditor />
                                
            </div>
        )
    }
    
    notAMember() {
        // TODO: make this check that I am not currently in this group
        return true;
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(ShowGroup))