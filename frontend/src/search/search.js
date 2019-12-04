import React from "react";
import {apiBaseURL} from "../App";
import {Redirect} from "react-router-dom"
import MenuBar from '../global-components/menuBar';
import {withCookies} from 'react-cookie';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            toGroups: false,
            groupId: '',
        }
        this.cookies = props.cookies;
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
            body: JSON.stringify({ userId: this.cookies.get('userId'), groupId: target.name })
        }
        fetch(new URL("groups/join", apiBaseURL), options)
            .then(() => this.setState({toGroups: true, groupId: target.name}),
                  err => console.log(err))
    }

    render() {
        if (!this.cookies.get('userId')) {
            return <Redirect to='/' />
        }
        if (this.state.toGroups) {
            return <Redirect to={"/groups/"+this.state.groupId} />
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
export default withCookies(Search)