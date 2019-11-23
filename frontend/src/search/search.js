import React from "react";
import {apiBaseURL} from "../App";
import {Redirect} from "react-router-dom"
import MenuBar from '../global-components/menuBar';

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
            body: JSON.stringify({ userId: this.state.user.id, groupId: target.id })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true}),
                  err => console.log(err))
    }

    render() {
        if (this.state.toGroups) {
            return <Redirect to="/groups" />
        }
        return (
            <div>
                <MenuBar pageName={'Search'}/>
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