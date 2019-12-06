import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ScheduleEditor from './scheduleEditor'

const styles = theme => ({
    closeButton: {
        marginRight: 15,
    },
    headerTitle: {
        flexGrow: 1,
    },
    generalPadding: {
        paddingTop: 20,
        paddingLeft: 20
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
        textAlign: 'center',
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
            groupSize: 0,
            isMember: true,
            userSchedule: {},
            allSchedules: [],
            
        }
        this.cookies = this.props.cookies;
        this.groupId = this.props.groupId;
        this.onJoin = this.onJoin.bind(this);
        this.openMessages = this.openMessages.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showVoting = this.showVoting.bind(this);
        this.onVeto = this.onVeto.bind(this);
        this.onApprove = this.onApprove.bind(this);
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

            url = new URL('/groups/mine', apiBaseURL)
            url.search = new URLSearchParams({userId: this.cookies.get('userId')}).toString()
            fetch(url)
            .then(resp => resp.json())
            .then(resp => this.setState({isMember: resp.groups.map(x => x.id).includes(this.groupId)}))

            //TODO get name of event
            this.setState({groupName: resp.group.name, visibility: resp.group.visibility, groupSize: resp.group.group_size})
        });

        url = new URL('/profile', apiBaseURL)
        url.search = new URLSearchParams({userId: this.cookies.get('userId')})
        fetch(url)
        .then(resp => resp.json())
        .then(resp => this.setState({username: resp.user.name}))

        url = new URL('/groupSchedules', apiBaseURL)
        url.search = new URLSearchParams({groupId: this.groupId})
        fetch(url)
        .then(resp => resp.json())
        .then(resp => this.setState({allSchedules: resp.schedules}))
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
    
    onSubmit() {
        let url = new URL('/updateSchedule', apiBaseURL)
        if (Object.keys(this.state.userSchedule).length !== 0) {
            const {first, second, third, fourth} = this.state.userSchedule;
            let options = {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    groupId: this.groupId,
                    userId: this.cookies.get('userId'),
                    seats: [first, second, third, fourth]
                })
            }
            fetch(url, options).then(resp => 
                window.location.reload()
            )
        }
    }

    onVeto() {
        let tempSched = this.state.allSchedules
        tempSched.forEach(schedule => {
            if (schedule.id === this.cookies.get('userId')) {
                schedule.timeBlocks = [null, null, null, null];
            }
        })
        this.setState({userSchedule: [null, null, null, null], allSchedules: tempSched})
        this.onSubmit()
    }

    onApprove() {
        console.log("approve")
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
                            {
                                this.state.allSchedules.map((schedule, index) => {
                                    if (schedule.owner === this.cookies.get('userId')) {
                                        return(
                                            <div key={index} >
                                                <Typography variant="body1" className={classes.generalPadding}>My Schedule</Typography>
                                                <ScheduleEditor enabled={!this.showVoting()} blocks={schedule.timeBlocks} groupId={this.groupId} callback={sched => this.setState({userSchedule: sched})}/>
                                            </div>)
                                    } else {
                                        return <ScheduleEditor key={index} blocks={schedule.timeBlocks} groupId={this.groupId} callback={sched => this.setState({userSchedule: sched})}/>
                                    }
                                })
                            }   
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Group Members:</Typography>
                            {this.state.memberNames.map((name, index) => (
                                <Typography variant="body1" key={index} className={classes.value}>{name}</Typography>))
                            }
                        </Paper>
                        { this.showVoting() &&
                            <div className={classes.bottomButton}>
                                <Typography variant="body1">Vote On Schedule</Typography>
                                <ButtonGroup variant="contained">
                                    <Button color="primary" onClick={this.onApprove}>Approve</Button>
                                    <Button color="secondary" onClick={this.onVeto}>Veto</Button>
                                </ButtonGroup>
                            </div>
                        }
                        { !this.showVoting() &&
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.bottomButton}
                                onClick={this.onSubmit}>
                                Save Schedule Changes
                            </Button>
                        }
                    </Grid>
                </Grid>    
                    
            </div>
        )
    }
    
    showVoting() {
        return this.state.memberNames.length === this.state.groupSize && 
            this.state.allSchedules.every(schedule => {
                return schedule.timeBlocks.every(value => !!value)
            })
    }

    notAMember() {
        return !this.state.isMember;
    }

    
}

export default withCookies(withStyles(styles, { withTheme: true })(ShowGroup))