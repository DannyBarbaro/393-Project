import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    bigBox: {
        backgroundColor: '#1c1c1c',
    },
    containerBox: {
        width: '66vw',
        minWidth: 500,
        backgroundColor: theme.palette.background.default,
        margin: 'auto',
        padding: 30
    },
    xsField: {
        margin: 10,
        width: 100,
    },
    sField: {
        margin: 10,
        width: 200,
    },
    mField: {
        margin: 10,
        width: 300,
    },
    lField: {
        margin: 10,
        width: 400,
    },
    generalPadding: {
        margin: 10,
    },
    profilePic: {
        width: 200,
        height: 200,
    },
    chip: {
        margin: 3,
    },
    teamIcon: {
        width: '100%',
    },
    errorMessage: {
        color: '#f54235',
    },
});

class GroupInfoForm extends Component {

    constructor(props) {
        super(props);
        this.callback = props.submit;
        this.state = {
            name: '',
            eventName: 'Superb Owl',
            eventId: '5dd9c9aee4b9b13f41d9fa8d', //TODO hardcoded for a single event
            visibility: 'public',
            groupSize: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        let target = e.target;
        console.log(target)
        console.log(target.name)
        console.log(target.value)
        this.setState({[target.name]: target.value});
        console.log(this.state.visibility)
    }

    onSubmit(e) {
        e.preventDefault();
        this.callback(this.state);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bigBox}>
                <Box className={classes.containerBox}>
                    <TextField
                        className={classes.sField}
                        label="Group Name"
                        name="name"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={this.requiredCheck(this.state.name)}
                        helperText={this.requiredCheck(this.state.name) ? 'Username Required' : ''}/>
                    <br/>
                    <TextField
                        disabled
                        className={classes.sField}
                        label="Event Name"
                        name="eventName"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.eventName}
                        error={this.requiredCheck(this.state.eventName)}
                        helperText={this.requiredCheck(this.state.eventName) ? 'Event is Required' : ''}/>
                    <br/>
                    <Select
                        labelId="group-size-select-label"
                        variant="outlined"
                        value={this.state.groupSize}
                        onChange={this.onChange}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                    </Select>
                    <br/>
                    <ToggleButtonGroup
                        value={this.state.visibility}
                        name="visibility"
                        exclusive
                        onChange={this.onChange}>
                        <ToggleButton name="visibility" value={"public"} color="secondary">
                            <Typography name="visibility" value={"private"} onClick={this.onChange}>Public</Typography>
                        </ToggleButton>
                        <ToggleButton name="visibility" value={"private"} color="secondary">
                            <Typography name="visibility" value={"private"} onClick={this.onChange}>Private</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {/* <input name="visibility" onChange={this.onChange} value={this.state.visibility} /> */}
                    <br/>
                    <Button variant="contained" color="primary" onClick={this.onSubmit}>Submit</Button>

                </Box>
            </div>
            // <form onSubmit={this.onSubmit}>
            //     <label>
            //         Group Name
            //         <input name="name" onChange={this.onChange} value={this.state.name} />
            //     </label>
            //     <br />
            //     <label>
            //         Event Name
            //         {/*TODO undisable this button*/}
            //         <input name="eventName" disabled onChange={this.onChange} value={this.state.eventName} />
            //     </label>
            //     <br />
            //     <label>
            //         Visibility
            //         <input name="visibility" onChange={this.onChange} value={this.state.visibility} />
            //     </label>
            //     <br />
            //     <input type="submit" value="Submit" />
            // </form>
        );
    }

    requiredCheck(param) {return !param || param.length === 0}
}

export default withStyles(styles, { withTheme: true })(GroupInfoForm)