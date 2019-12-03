import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { apiBaseURL } from '../App';
import { withStyles } from '@material-ui/core/styles';
import ShowGroup from './showGroup';
import MenuBar from '../global-components/menuBar';
import UserContext from '../UserContext'
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
    rightContainer:{
        background: '#000000',
        height: '90vh',
        minHeight: 500,
    },
    outer: {
        width: '100vw'
    }
});

class Groups extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            newGroup: false,
            search: false,
        }
        this.groupId = props.match.params.id;
        this.onLeave = this.onLeave.bind(this);
    }

    componentDidMount() {
        let url = new URL('groups/mine', apiBaseURL)
        url.search = new URLSearchParams({userId: this.context.userId}).toString();
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
            body: JSON.stringify({userId: this.context.userId, groupId: target.name})
        }
        fetch(url, options)
        .then(() => this.componentDidMount(),
                err => console.log(err))
    }

    render() {
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
                                            <Fab variant="extended" color="secondary" name={group.id} onClick={this.onLeave}>
                                                <Typography name={group.id} onClick={this.onLeave}>Leave</Typography>
                                            </Fab>
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
                    <Grid item xs={12} sm={8} className={classes.rightContainer}>
                        { this.props.location.pathname.substring(8) !== '' &&
                            <ShowGroup groupId={this.props.location.pathname.substring(8)}/>
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Groups)