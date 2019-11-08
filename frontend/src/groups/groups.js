import React from "react";
import {apiBaseURL} from "../App";

export default class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            groups: []
        }
        this.onLeave = this.onLeave.bind(this);
        this.onMakeNewGroup = this.onMakeNewGroup.bind(this);
    }

    componentDidMount() {
        let url = new URL('groups/mine', apiBaseURL)
        url.search = new URLSearchParams({user_id: this.state.user.id}).toString();
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
        url.search = new URLSearchParams({userId: this.state.user.id, groupID: target.id}).toString();
        fetch(url)
            .then(() => this.componentDidMount(),
                  err => console.log(err))
    }

    onMakeNewGroup(e) {
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({group: { name: "new group", members: [this.state.user], owner: this.state.user, event: "Souper Bowl", visibility: "public" }})
        }
        let url = new URL('createGroup', apiBaseURL)
        fetch(url, options)
            .then(() => this.componentDidMount(),
                  err => console.log(err))
    }

    render() {
        console.log(this);
        return (
            <div>
                <h1>This is the groups page!</h1>
                {!this.state.groups && 
                    <div>
                        <h2>Here are your groups! Huzzah!</h2>
                        <ul>
                            {this.state.groups.map((group, index) => (
                                <li key={index}>{group.name}
                                <button name={group.id} onClick={this.onLeave}>Leave</button></li>))}
                        </ul>
                    </div>
                }
                <button name="new-group" onClick={this.onMakeNewGroup}>Create New Group</button>
            </div>
        );
    }
}