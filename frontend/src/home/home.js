import React from "react";
import {apiBaseURL} from "../App";
import { GoogleLogin, GoogleLogout} from 'react-google-login';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: "none"};
    }

    componentDidMount() {
        fetch(apiBaseURL+"test")
            .then(resp => resp.json())
            .then(
                resp => this.setState({message: resp.thing}),
                err => console.log(err)
            );
    }

    render() {
        return (
            <div>
                <h1>SeatSwap</h1>
                <p>{this.state.message}</p>
            </div>
        );
    }
}