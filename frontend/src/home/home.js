import React from "react";
import HomeTopBar from './components/homeTopBar';
import HomePhotoDisplay from './components/homePhotoDisplay';
import HomeBenefits from './components/homeBenefits';
import HomeFooter from './components/homeFooter';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.switchUser = props.updater;
    }

    render() {
        return (
            <div>
                <HomeTopBar updater={this.switchUser}/>
                <HomePhotoDisplay/>
                <HomeBenefits/>
                <HomeFooter/>
            </div>
        );
    }
}
