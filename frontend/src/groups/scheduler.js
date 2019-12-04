import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
});

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.cookies = this.props.cookies;
    }

    render() {
        if (!this.cookies.get('userId')) {
            return <Redirect to='/' />
        }
        const { classes } = this.props
        return (
            <div>
                <Typography variant="h3">Please Dear God Save Me</Typography>
            </div>
        );
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(Scheduler))