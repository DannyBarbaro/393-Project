import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Redirect } from 'react-router-dom';
import { fade, withStyles } from '@material-ui/core/styles';
import MenuBar from '../global-components/menuBar';
import UserContext from '../UserContext';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    headerBar: {
        width: '100vw',
        background : '#000000',
    },
    headerRow: {
        background : '#100000',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
});

class Search extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            toGroups: false,
            groupId: '',
            columns: [],
            data: [],
            rows: [
                {name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0},
                {name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3},
                {name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0},
                {name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3},
                {name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9},
            ]
        }
        this.onJoin = this.onJoin.bind(this);
    }

    

    componentDidMount() {
        fetch(new URL("groups/list", apiBaseURL))
            .then(resp => resp.json())
            .then(resp => this.setState({groups: resp.groups}),
                  err => console.log(err));
    }

    onJoin(event) {
        let target = event.target;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userId: this.context.userId, groupId: target.id })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.id}),
                  err => console.log(err))
    }

    render() {
        if (this.state.toGroups) {
            return <Redirect to={"/groups/"+this.state.groupId} />
        }
        const { classes } = this.props;
        return (
            <div>
                <MenuBar pageName={'Search'}/>
                <AppBar position="static" className={classes.headerBar}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Groups Available to Join
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
                <Paper className={classes.root}>
                    <Table stickyHeader className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Group Name</TableCell>
                                <TableCell align="right">Event</TableCell>
                                <TableCell align="right">Number of Members</TableCell>
                                <TableCell align="right">Owner</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.groups.map((group, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {group.name}
                                </TableCell>
                                <TableCell align="right">{group.eventName}</TableCell>
                                <TableCell align="right">{group.members.length}</TableCell>
                                <TableCell align="right">{group.ownerName}</TableCell>
                                <TableCell align="right">
                                    <Fab variant="extended" color="primary" id={group.id} onClick={this.onJoin}>
                                        <Typography id={group.id} onClick={this.onJoin}>Join</Typography>
                                    </Fab>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Search)