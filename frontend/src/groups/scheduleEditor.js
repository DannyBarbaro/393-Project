import React from 'react';
import {withCookies} from 'react-cookie'

class ScheduleEditor extends React.Component {
    constructor(props) {
        super(props)
        this.cookies = props.cookies;
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return <p>lul</p>
    }
}

export default withCookies(ScheduleEditor);