import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { apiBaseURL } from '../App';
import { withStyles } from '@material-ui/core/styles';
import MenuBar from '../global-components/menuBar';
import UserContext from '../UserContext'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const styles = theme => ({
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

                {!!this.state.groups &&
                    <div>
                    <Typography variant="h5">My Groups</Typography>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Group Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.groups.map((group, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {group.name}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                    // <div>
                    //     <ul>
                    //         {this.state.groups.map((group, index) => (
                    //             <li key={index}><Link to={'/groups/'+group.id}>{group.name}</Link>
                    //             <button name={group.id} onClick={this.onLeave}>Leave</button></li>))}
                    //     </ul>
                    // </div>
                }
                <Button name="new-group" variant="contained" onClick={() => this.setState({newGroup: true})}>Create New Group</Button>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Groups)