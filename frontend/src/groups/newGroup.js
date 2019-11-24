import React from 'react';
import {Redirect} from 'react-router-dom'
import GroupInfoForm from './groupInfoForm'
import {apiBaseURL} from '../App'
import UserContext from '../UserContext'

export default class NewGroup extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            groupId: null,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(newGroup) {
        let url = new URL('createGroup', apiBaseURL);
        newGroup.ownerId = this.context.userId;
        newGroup.members = [this.context.userId];
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({group: newGroup})
        }
        fetch(url, options)
        .then(resp => resp.json())
        .then(resp => this.setState({finished: true, groupId: resp.groupId}))
    }

    render() {
        if (this.state.finished) {
            return <Redirect to={'/groups/' + this.state.groupId} />
        }
        return (
            <div>
                <h1>Enter the info for your new group:</h1>
                <GroupInfoForm submit={this.onSubmit}/>
            </div>
        );
    }
}