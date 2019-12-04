import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { apiBaseURL } from '../App';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {withCookies} from 'react-cookie';
import ShowGroup from './showGroup';
import MenuBar from '../global-components/menuBar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
    root:{
        flexGrow: 1,
    },
    generalPadding: {
        margin: 15
    },
    rightContainerFilled:{
        height: '92vh',
        minHeight: 500,
        borderLeft: '4px solid #000000',
    },
    rightContainerEmpty:{
    },
    outer: {
        width: '100vw'
    }
});

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            newGroup: false,
            search: false,
        }
        this.cookies = this.props.cookies;
        this.onLeave = this.onLeave.bind(this);
        this.onDisband = this.onDisband.bind(this);
    }

    componentDidMount() {
        let url = new URL('groups/mine', apiBaseURL)
        url.search = new URLSearchParams({userId: this.cookies.get('userId')}).toString();
        fetch(url)
            .then(resp => resp.json())
            .then(resp => {
                if (!!resp.groups) {
                    this.setState({groups: resp.groups})
                } else {
                    this.setState({groups: []});
                }
            },
            err => console.log(err));
    }

    onLeave(e) {
        let target = e.target;
        let url = new URL('groups/leave', apiBaseURL)
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({userId: this.cookies.get('userId'), groupId: target.id})
        }
        fetch(url, options)
        .then(() => this.componentDidMount(),
                err => console.log(err))
    }

    onDisband(e) {
        let target = e.target;
        let url = new URL('groups/nukem', apiBaseURL)
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({ownerId: this.cookies.get('userId'), groupId: target.id})
        }
        fetch(url, options)
        .then(() => this.componentDidMount(),
                err => console.log(err))
    }

    render() {
        if (!this.cookies.get('userId')) {
            return <Redirect to='/' />
        }
        if (this.state.newGroup) {
            return <Redirect to={'/groups/new'} />
        }
        const { classes } = this.props;
        return (
            <div>
                <MenuBar pageName={'Groups'}/>
                <Grid container className={classes.outer}>
                    <Grid item xs={12} sm={4}>
                        {!!this.state.groups &&
                            <div>
                            <Typography variant="h5" className={classes.generalPadding}>My Groups</Typography>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Group Name</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.groups.map((group, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                <Button component={ Link } to={'/groups/'+group.id} variant="contained" color="primary">
                                                    {group.name}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                { group.ownerId !== this.cookies.get('userId') &&
                                                    <Fab variant="extended" color="secondary" id={group.id} onClick={this.onLeave}>
                                                        <Typography id={group.id}>Leave</Typography>
                                                    </Fab>
                                                }
                                                { group.ownerId === this.cookies.get('userId') &&
                                                    <Fab variant="extended" color="secondary" id={group.id} onClick={this.onDisband} component={Link}
                                                    to='/groups'>
                                                        <Typography id={group.id}>Disband</Typography>
                                                    </Fab>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                    }
                    <Button
                        name="new-group"
                        variant="contained"
                        className={classes.generalPadding}
                        onClick={() => this.setState({newGroup: true})}>Create New Group</Button>
                    </Grid>
                    { this.props.location.pathname.substring(8) !== '' &&
                        <Grid item xs={12} sm={8} className={classes.rightContainerFilled}>
                            <ShowGroup groupId={this.props.location.pathname.substring(8)}/>
                        </Grid>
                    }
                </Grid>
            </div>
        );
    }
}

export default withCookies(withRouter(withStyles(styles, { withTheme: true })(Groups)))