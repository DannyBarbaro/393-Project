import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
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
        minHeight: 120,
        justifyContent: 'center'
    },
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
        this.groupId = this.props.groupId;
        this.onJoin = this.onJoin.bind(this);
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
            body: JSON.stringify({ userId: this.context.userId, groupId: target.name })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.name}),
                  err => console.log(err))
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
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Group Name:</Typography>
                            <Typography variant="body1" className={classes.value}>{this.state.groupName}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Owner Name:</Typography>
                            <Typography variant="body1" className={classes.value}>{this.state.ownerName}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Group Visibility:</Typography>
                                <Typography variant="body1" className={classes.value}>{this.state.visibility === 'private' ? 'Private' : 'Public'}</Typography>
                                {this.state.visibility === 'private' && this.notAMember() &&
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
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.groupPaper}>
                            <Typography variant="h6" className={classes.title}>Group Members:</Typography>
                            {this.state.memberNames.map((name, index) => (
                                <Typography variant="body1" key={index} className={classes.value}>{name}</Typography>))
                            }
                        </Paper>
                    </Grid>
                </Grid>
                                
            </div>
        )
    }
    
    notAMember() {
        // TODO: make this check that I am not currently in this group
        return true;
    }
}

export default withStyles(styles, { withTheme: true })(ShowGroup)