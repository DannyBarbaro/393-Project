import React from "react";
import {apiBaseURL} from "../App";
//import { GoogleLogin, GoogleLogout } from 'react-google-login';
import HomeTopBar from './components/homeTopBar';
import HomePhotoDisplay from './components/homePhotoDisplay';
import HomeBenefits from './components/homeBenefits';
import HomeFooter from './components/homeFooter';

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
                <HomeTopBar/>
                <HomePhotoDisplay/>
                <HomeBenefits/>
                <HomeFooter/>
            </div>
        );
    }
}

// 533888169623-nh1rg4gah4iuka3n5mn9iphhugtaedk8.apps.googleusercontent.com   -> client ID
// oL_FAKN7z1kVvEsQj-tBl8T5   -> secret
