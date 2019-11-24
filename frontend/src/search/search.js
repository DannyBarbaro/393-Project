import React from "react";
import {apiBaseURL} from "../App";
import {Redirect} from "react-router-dom"
import UserContext from '../UserContext'

export default class Search extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            toGroups: false,
            groupId: '',
        }
        this.onJoin = this.onJoin.bind(this);
    }

    componentDidMount() {
        fetch(new URL("groups/list", apiBaseURL))
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
            body: JSON.stringify({ userId: this.context.userId, groupId: target.name })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.name}),
                  err => console.log(err))
    }

    render() {
        if (this.state.toGroups) {
            return <Redirect to={"/groups/"+this.state.groupId} />
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