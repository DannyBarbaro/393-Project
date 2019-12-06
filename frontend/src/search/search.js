import React, { Component } from 'react';
import { apiBaseURL } from '../App';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { fade, withStyles } from '@material-ui/core/styles';
import MenuBar from '../global-components/menuBar';
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
import Button from '@material-ui/core/Button';

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
        marginRight: 0,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
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
            width: 400,
        },
    },
});

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            searchedGroups: [],
            toGroups: false,
            groupId: '',
            searchString: '',
        }
        this.cookies = props.cookies;
        this.onJoin = this.onJoin.bind(this);
        this.onChange = this.onChange.bind(this);
        this.enterPressed = this.enterPressed.bind(this);
        this.searchTable = this.searchTable.bind(this);
    }  

    componentDidMount() {
        fetch(new URL("groups/list", apiBaseURL))
            .then(resp => resp.json())
            .then(resp => {
                this.setState({groups: resp.groups})
                this.setState({searchedGroups: resp.groups})
            },
                  err => console.log(err));
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onJoin(event) {
        let target = event.target;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userId: this.cookies.get('userId'), groupId: target.id })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.id}),
                  err => console.log(err))
    }

    render() {
        if (!this.cookies.get('userId')) {
            return <Redirect to='/' />
        }
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
                            name="searchString"
                            value={this.state.searchString}
                            onChange={this.onChange}
                            onKeyDown={this.enterPressed}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}/>
                        </div>
                        <Button variant="contained" color="primary" onClick={this.searchTable}>Search</Button>
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
                        <TableBody size="small">
                        {this.state.searchedGroups.map((group, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {group.name}
                                </TableCell>
                                <TableCell align="right">{group.eventName}</TableCell>
                                <TableCell align="right">{group.members.length + ' / ' + group.group_size}</TableCell>
                                <TableCell align="right">{group.ownerName}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="primary" id={group.id} onClick={this.onJoin}>
                                        <Typography id={group.id}>Join</Typography>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) { this.searchTable() } 
    }

    searchTable() {
        let lowercased = this.state.searchString.toLowerCase()
        this.setState({searchedGroups : 
            this.state.groups.filter(group => {
                return group.name.toLowerCase().includes(lowercased) ||
                    group.eventName.toLowerCase().includes(lowercased) ||
                    group.ownerName.toLowerCase().includes(lowercased)
            })
        });
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(Search))
