import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    bigBox: {
        backgroundColor: theme.palette.background.default,
    },
    containerBox: {
        width: '66vw',
        minWidth: 500,
        backgroundColor: '#1c1c1c',
        margin: 'auto',
        padding: 30
    },
    mField: {
        margin: 10,
        width: 300,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    formControlLong: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    labelPadding: {
        marginLeft: 10,
        marginTop: 10,
    },
    generalPadding: {
        margin: 10,
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
            groupSize: 4,
            errorMessage: false,
        }
        this.onChange = this.onChange.bind(this)
        this.toggleButton = this.toggleButton.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    toggleButton(e){
        let target = e.target
        this.setState({visibility: target.id});
    }

    onSubmit(e) {
        e.preventDefault();
        if(this.checkAll()) {
            this.setState({errorMessage: true});
        } else {
            this.callback(this.state)
        }
    }

    componentDidMount() {
        
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bigBox}>
                <Box className={classes.containerBox}>
                    <TextField
                        className={classes.mField}
                        label="Group Name"
                        name="name"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={this.requiredCheck(this.state.name)}
                        helperText={this.requiredCheck(this.state.name) ? 'Group Name Required' : ''}/>
                    <br/>
                    <FormControl variant="filled" className={classes.formControlLong}>
                        <InputLabel className={classes.labelPadding} id="event-select-label">
                            Event
                        </InputLabel>
                        <Select
                            labelId="event-select-label"
                            name="eventName"
                            value={this.state.eventName}
                            className={classes.generalPadding}
                            onChange={this.onChange}>
                            {/* { this.state.events.map((event, index) => (
                                <MenuItem key={index} value={event.id}>{event.name}</MenuItem>
                            ))} */}
                        </Select>
                    </FormControl>
                    <br/>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel className={classes.labelPadding} id="size-select-label">
                            Group Size
                        </InputLabel>
                        <Select
                            labelId="size-select-label"
                            name="groupSize"
                            value={this.state.groupSize}
                            className={classes.generalPadding}
                            onChange={this.onChange}>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>
                    <ToggleButtonGroup
                        className={classes.generalPadding}
                        value={this.state.visibility}
                        name="visibility"
                        exclusive
                        onChange={this.onChange}>
                        <ToggleButton name="visibility" value={"public"}>
                            <Typography id="public" onClick={this.toggleButton}>Public</Typography>
                        </ToggleButton>
                        <ToggleButton name="visibility" value={"private"}>
                            <Typography id="private" onClick={this.toggleButton}>Private</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <br/>
                    { this.state.errorMessage &&
                        <Typography variant="h6" className={classes.errorMessage}>Please make sure you filled everything out correctly!</Typography>
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.generalPadding}
                        onClick={this.onSubmit}>
                        Submit
                    </Button>

                </Box>
            </div>
        );
    }

    requiredCheck(param) {return !param || param.length === 0}
    checkAll(){
        return this.requiredCheck(this.state.name) || this.requiredCheck(this.state.eventName)
    }
}

export default withStyles(styles, { withTheme: true })(GroupInfoForm)