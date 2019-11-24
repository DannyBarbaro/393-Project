import React from "react";
import {apiBaseURL} from "../App";
import UserContext from '../UserContext'

export default class UserInfoForm extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        if (props.newUser) {
            this.state = {
                email: props.user.email,
                isNew: true,
                callback: props.callback,
            }
        } else {
            this.state = {
                email: props.user.email,
                name: props.user.name,
                cardNum: props.user.cardNum,
                isNew: false,
                callback: props.callback
            };
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.processCallback = this.processCallback.bind(this);
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        let body = Object.assign({}, this.state);
        body.id = this.context.userId;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({user: body})
        }
        let url;
        if (this.state.isNew) {
            url = new URL('addUser', apiBaseURL);
        } else {
            url = new URL('updateUser', apiBaseURL);
        }
        fetch(url, options)
        .then(resp => resp.json())
        .then(resp => {
            if (!!resp.userId) {
                this.context.changeUserId(resp.userId)
            }
            this.processCallback()
        });
        e.preventDefault()
    }

    processCallback() {
        if (!!this.state.callback) {
            this.state.callback();
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
                    <input disabled name="email" onChange={this.onChange} value={this.state.email} />
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