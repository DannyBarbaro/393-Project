import React from "react";
import {apiBaseURL} from "../App";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: "none"};
    }

    componentDidMount() {
        fetch(apiBaseURL+"test")
            .then(resp => resp.json())
            .then(
                resp => {console.log(resp); this.setState({message: resp.thing}); console.log(this.state)},
                err => console.log(err)
            );
    }

    render() {
        return (
            <div>
                <h1>hOmE</h1>
                <p>{this.state.message}</p>
            </div>
        );
    }
}