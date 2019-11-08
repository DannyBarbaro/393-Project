import React from "react";
import {apiBaseURL} from "../App";
import { GoogleLogin, GoogleLogout } from 'react-google-login';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "SeatSwap is a whole new way to attend sporting events. You and your group can split the cost of an expensive ticket and rotate through for a portion of the cost of the normal ticket. Higher quality for a lower price!",
            auth: false,
            error: false
        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <h1>SeatSwap</h1>
                <p>{this.state.message}</p>
                <div hidden={this.state.auth}>
                    <GoogleLogin
                        clientId="533888169623-nh1rg4gah4iuka3n5mn9iphhugtaedk8.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={this.completeLogin}
                        onFailure={this.registerFailure}
                    />
                </div>
                <p style={{color: 'red'}} hidden={!this.state.error}>
                    Sorry! That login you provided is invalid
                </p>
                <div hidden={!this.state.auth}>
                    <GoogleLogout
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}>
                    </GoogleLogout>
                </div>
            </div>
        );
    }

    completeLogin = (response) => {
        console.log(response);
        this.setState({auth: true});
        this.setState({error: false});
    }
      
    registerFailure = (fail) => {
        console.log(fail);
        this.setState({auth: false});
        this.setState({error: true});
    }

    logout = (response) => {
        console.log(response);
        this.setState({auth: false});
        this.setState({error: false});
    }

}

// 533888169623-nh1rg4gah4iuka3n5mn9iphhugtaedk8.apps.googleusercontent.com   -> client ID
// oL_FAKN7z1kVvEsQj-tBl8T5   -> secret
