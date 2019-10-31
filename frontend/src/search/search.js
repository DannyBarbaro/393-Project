import React from "react";
import {apiBaseURL} from "../App";
import {Redirect} from "react-router-dom"

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            group: [],
            toGroups: false
        }
        this.onJoin = this.onJoin.bind(this);
    }

    componentDidMount() {
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "GET"
        }
        fetch(apiBaseURL + "groups/list", options)
            .then(resp => resp.json())
            .then(resp => this.setState({groups: resp.groups}),
                  err => console.log(err));
    }

    onJoin(e) {
        let target = e.target;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ user: this.state.user, id: target.name })
        }
        fetch(apiBaseURL + "groups/join", options)
            .then(() => this.setState({toGroups: true}),
                  err => console.log(err))
    }

    render() {
        if (this.state.toGroups) {
            return <Redirect to="/groups" />
        }
        return (
            <div>
                <h1>This is where you can find new groups to join!</h1>
                {this.state.groups &&
                    <div>
                        <h2>Take a look at these here groups!</h2>
                        <ul>
                            {this.state.groups.map((group, index) => (
                                <li key={index}>{group.name}
                                    <button name={group.id} onClick={this.onJoin}>Join</button></li>))}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}