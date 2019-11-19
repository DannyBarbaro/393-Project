import React, {Component} from 'react';
import { apiBaseURL } from "../App";
import UserContext from '../UserContext';
import UserInfoForm from "./userInfoForm";

import {Link, Redirect} from 'react-router-dom';
import MenuBar from '../global-components/menuBar';

export default class Profile extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            user: {},
            invalid: false,
        };
        this.editButton = this.editButton.bind(this);
    }

    componentDidMount() {
        let url = new URL('profile', apiBaseURL);
        url.search = new URLSearchParams({userId: this.context.userId}).toString();
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            if (!!resp) {
                this.setState({user: resp.user});
            } else {
                this.setState({invalid: true});
            }
        });
    }

    editButton(e) {
        this.setState({editing: true});
    }

    render() {
        if (this.state.invalid) {
            return <Redirect to='/home' />
        }
        return (
            <div>
                <MenuBar pageName={'Profile'}/>
                {!this.state.editing &&
                    <div>
                        <p>Name: {this.state.user.name}</p>
                        <p>Email Address: {this.state.user.email}</p>
                        <p>Credit Card Number (trust us, it's secure): {this.state.user.cardNum}</p>
                        <button onClick={this.editButton}>Edit</button>
                    </div>
                }
                {this.state.editing &&
                    <UserInfoForm user={this.state.user}
                        callback={new_user => this.setState({editing: false, user: new_user})} />
                }
                <Link to="/groups">My Groups</Link>
            </div>
        );
    }
}