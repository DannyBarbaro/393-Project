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
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        let toSend = Object.assign({}, this.state);
        toSend.card_num = toSend.cardNum;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({user: toSend})
        }
        if (this.state.isNew) {
            fetch(apiBaseURL + 'addUser', options)
        } else {
            fetch(apiBaseURL + "updateUser", options);
        }
        if (!!this.state.callback) {
            this.state.callback(toSend);
        }
        e.preventDefault()
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