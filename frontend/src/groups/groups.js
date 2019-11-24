import React from "react";
import {Redirect} from 'react-router-dom'
import {apiBaseURL} from "../App";
import UserContext from '../UserContext'

export default class Groups extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            newGroup: false,
        }
        this.onLeave = this.onLeave.bind(this);
    }

    componentDidMount() {
        let url = new URL('groups/mine', apiBaseURL)
        url.search = new URLSearchParams({userId: this.context.userId}).toString();
        fetch(url)
            .then(resp => resp.json())
            .then(resp => {
                if (!!resp.groups) {
                    this.setState({groups: resp.groups})
                } else {
                    this.setState({groups: []});
                }
                
            },
            err => console.log(err));
    }

    onLeave(e) {
        let target = e.target;
        let url = new URL('groups/leave', apiBaseURL)
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({userId: this.context.userId, groupId: target.name})
        }
        fetch(url, options)
        .then(() => this.componentDidMount(),
                err => console.log(err))
    }

    render() {
        if (this.state.newGroup) {
            return <Redirect to={'/groups/new'} />
        }
        return (
            <div>
                <h1>This is the groups page!</h1>
                <h2>Here are your groups! Huzzah!</h2>
                {!!this.state.groups && 
                    <div>
                        <ul>
                            {this.state.groups.map((group, index) => (
                                <li key={index}>{group.name}
                                <button name={group.id} onClick={this.onLeave}>Leave</button></li>))}
                        </ul>
                    </div>
                }
                <button name="new-group" onClick={() => this.setState({newGroup: true})}>Create New Group</button>
            </div>
        );
    }
}