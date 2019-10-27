import React from "react";
import EditUserInfo from "./edit-user-info";
import {Link} from "react-router-dom";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            user: props.user
        };
        this.editButton = this.editButton.bind(this);
    }

    editButton(e) {
        this.setState({editing: true});
    }

    render() {
        return (
            <div>
                <h1>This is the profile page</h1>
                {!this.state.editing &&
                    <div>
                        <p>Name: {this.state.user.name}</p>
                        <p>Email Address: {this.state.user.email}</p>
                        <p>Credit Card Number (trust us, it's secure): {this.state.user.cardNum}</p>
                        <button onClick={this.editButton}>Edit</button>
                    </div>
                }
                {this.state.editing &&
                    <EditUserInfo user={this.state.user} isNewUser={false}
                                  callback={new_user => this.setState({editing: false, user: new_user})} />
                }
                <Link to="/groups">My Groups</Link>

            </div>
        );
    }
}