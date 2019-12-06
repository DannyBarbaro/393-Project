import React from 'react';
import {withCookies} from 'react-cookie'
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from '../App';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    formControl: {
        marginRight: 5,
        minWidth: 170,
        maxWidth: 170
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
            first: !props.blocks[0] ? "" : props.blocks[0],
            second: !props.blocks[1] ? "" : props.blocks[1],
            third: !props.blocks[2] ? "" : props.blocks[2],
            fourth: !props.blocks[3] ? "" : props.blocks[3],
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
            url.search = new URLSearchParams({groupId: this.props.groupId, userId: this.cookies.get('userId')});
            fetch(url)
            .then(seats => seats.json())
            .then(seats => {
                this.setState({groupObj: resp.group, openSeats: seats.openSeats})
            })
        });
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});

        const updated = {
            first: this.state.first,
            second: this.state.second,
            third: this.state.third,
            fourth: this.state.fourth,
        };
        this.props.callback(Object.assign(updated, {[target.name]: target.value}))
    }

    render() {
        const { classes } = this.props;
        if (!this.state.openSeats) {
            return null;
        }
        return (
            <FormGroup row>
                {!!this.props.enabled && <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="first">
                        First seat
                    </InputLabel>
                    <Select
                        labelId="first"
                        name="first"
                        value={this.state.first}
                        className={classes.generalPadding}
                        disabled={!this.props.enabled}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[0].map((seat, index) => {
                                return <MenuItem key={index} value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>}
                {!this.props.enabled && <TextField className={classes.formControl}
                    label="first"
                    disabled
                    value={this.state.first}/>}

                {!!this.props.enabled && <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="second">
                        Second seat
                    </InputLabel>
                    <Select
                        labelId="second"
                        name="second"
                        value={this.state.second}
                        className={classes.generalPadding}
                        disabled={!this.props.enabled}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[1].map((seat, index) => {
                                return <MenuItem key={index} value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>}
                {!this.props.enabled && <TextField className={classes.formControl}
                    label="second"
                    disabled
                    value={this.state.second}/>}

                {!!this.props.enabled && <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="third">
                        Third seat
                    </InputLabel>
                    <Select
                        labelId="third"
                        name="third"
                        value={this.state.third}
                        className={classes.generalPadding}
                        disabled={!this.props.enabled}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[2].map((seat, index) => {
                                return <MenuItem key={index} value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>}
                {!this.props.enabled && <TextField className={classes.formControl}
                    label="third"
                    disabled
                    value={this.state.third}/>}
                
                {!!this.props.enabled && <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.labelPadding} id="fourth">
                        Fourth seat
                    </InputLabel>
                    <Select
                        labelId="fourth"
                        name="fourth"
                        value={this.state.fourth}
                        className={classes.generalPadding}
                        disabled={!this.props.enabled}
                        onChange={this.onChange}>
                        {
                            this.state.openSeats[3].map((seat, index) => {
                                return <MenuItem key={index} value={seat}>{seat}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>}
                {!this.props.enabled && <TextField className={classes.formControl}
                    label="fourth"
                    disabled
                    value={this.state.fourth}/>}
            </FormGroup>
        );
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(ScheduleEditor));