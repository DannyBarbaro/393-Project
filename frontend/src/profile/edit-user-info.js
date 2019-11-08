import React from "react";
import {apiBaseURL} from "../App";

export default class EditUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.user.email,
            name: props.user.name,
            cardNum: props.user.cardNum,
            isNew: props.isNewUser,
            callback: props.callback
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.processCallback = this.processCallback.bind(this);
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({user: this.state})
        }
        if (this.state.isNew) {
            var url = new URL('addUser', apiBaseURL);
        } else {
            var url = new URL('updateUser', apiBaseURL);
        }
        fetch(url, options)
            .then(this.processCallback());
        e.preventDefault()
    }

    processCallback() {
        if (!!this.state.callback) {
            this.state.callback(this.state);
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <label>
                    Name
                    <input name="name" onChange={this.onChange} value={this.state.name} />
                </label>
                <br />
                <label>
                    Email Address
                    <input name="email" onChange={this.onChange} value={this.state.email} />
                </label>
                <br />
                <label>
                    Credit Card Number
                    <input name="cardNum" onChange={this.onChange} value={this.state.cardNum} />
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}