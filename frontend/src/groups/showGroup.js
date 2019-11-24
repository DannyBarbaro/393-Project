import React from 'react';
import {apiBaseURL} from '../App'

export default class ShowGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            memberNames: [],
            ownerName: '',
            eventName: '',
            visibility: '',
        }
        this.groupId = props.match.params.id;
    }

    componentDidMount() {
        let url = new URL('/groups', apiBaseURL);
        url.search = new URLSearchParams({id: this.groupId}).toString()
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            let url = new URL('/users', apiBaseURL)
            url.search = 'id=' + resp.group.members.reduce((total, id) => total + '&id=' + id)
            fetch(url)
            .then(resp => resp.json())
            .then(resp => this.setState({memberNames: resp.usernames}))

            url.search = new URLSearchParams({id: resp.group.ownerId}).toString()
            fetch(url)
            .then(resp => resp.json())
            .then(resp => this.setState({ownerName: resp.usernames[0]}))

            //TODO get name of event
            this.setState({groupName: resp.group.name, visibility: resp.group.visibility})
        })
    }
    
    render() {
        return (
            <div>
                <h1>All that good group stuff</h1>
                <p>Group name: {this.state.groupName}</p>
                <p>Owner Name: {this.state.ownerName}</p>
                <p>Group Members:</p>
                <ul>
                    {this.state.memberNames.map((name, index) => (
                        <li key={index}>{name}</li>))}
                </ul>
                <p>Group visibility: {this.state.visibility}</p>
            </div>
        )
    }
}