import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    closeButton: {
        marginRight: 15,
    },
    headerTitle: {
        flexGrow: 1,
    },
    title:{
        paddingTop: 10,
        paddingLeft: 15
    },
    value:{
        paddingLeft: 35
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
        this.groupId = this.props.groupId;
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
                <Typography variant="h6" className={classes.title}>Group Name:</Typography>
                <Typography variant="p" className={classes.value}>{this.state.groupName}</Typography>
                <Typography variant="h6" className={classes.title}>Owner Name:</Typography>
                <Typography variant="p" className={classes.value}>{this.state.ownerName}</Typography>
                <Typography variant="h6" className={classes.title}>Group Members:</Typography>
                {this.state.memberNames.map((name, index) => (
                    <Typography variant="p" key={index} className={classes.value}>{name}</Typography>))
                }
                <Typography variant="h5" className={classes.title}>Group Visibility:</Typography>
                <Typography variant="h6" className={classes.value}>{this.state.visibility}</Typography>
                <br/>
                {}
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ShowGroup)