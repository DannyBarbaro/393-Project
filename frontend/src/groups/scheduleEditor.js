import React from 'react';
import {withCookies} from 'react-cookie'
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from '../App';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    generalPadding: {
        margin: 10,
    },
});

class ScheduleEditor extends React.Component {
    constructor(props) {
        super(props)
        this.cookies = props.cookies;
        this.state = {
            groupObj: {},
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        let url = new URL('/groups', apiBaseURL);
        url.search = new URLSearchParams({id: this.props.groupId});
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            url = new URL('/openSeats', apiBaseURL)
            url.search = new URLSearchParams({groupId: this.props.groupId});
            fetch(url)
            .then(seats => seats.json())
            .then(seats => {
                this.setState({groupObj: resp.group, openSeats: seats})
            })
        });
    }

    onChange(e) {
        let key = e.target.name;
        console.log(key)
    }

    render() {
        console.log(this.state)
        const { classes } = this.props;
        if (!this.state.openSeats) {
            return null;
        }
        return (
            <FormGroup>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="first">
                        First seat
                    </InputLabel>
                    <Select
                        labelId="first"
                        id={0}
                        value={''}
                        className={classes.generalPadding}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[0].map((seat, index) => {
                                return <MenuItem value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>

                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="second">
                        First seat
                    </InputLabel>
                    <Select
                        labelId="second"
                        id={1}
                        value={''}
                        className={classes.generalPadding}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[1].map((seat, index) => {
                                return <MenuItem value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>

                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="third">
                        First seat
                    </InputLabel>
                    <Select
                        labelId="third"
                        id={2}
                        value={''}
                        className={classes.generalPadding}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[2].map((seat, index) => {
                                return <MenuItem value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="fourth">
                        First seat
                    </InputLabel>
                    <Select
                        labelId="fourth"
                        id={3}
                        value={''}
                        className={classes.generalPadding}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[3].map((seat, index) => {
                                return <MenuItem value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </FormGroup>
        );
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(ScheduleEditor));