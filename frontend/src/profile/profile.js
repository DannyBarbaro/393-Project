import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from '../App';
import UserInfoForm from './userInfoForm';
import InfoViewer from './infoViewer';
import { Redirect } from 'react-router-dom';
import MenuBar from '../global-components/menuBar';
import {withCookies} from 'react-cookie';

const styles = theme => ({
});

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            user: {},
            invalid: false,
        };
        this.cookies = this.props.cookies;
        this.editButton = this.editButton.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        let url = new URL('profile', apiBaseURL);
        url.search = new URLSearchParams({userId: this.cookies.get('userId')}).toString();
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            if (!!resp) {
                this.setState({user: resp.user});
            } else {
                this.setState({invalid: true});
            }
        });
    }

    editButton(e) {
        this.setState({editing: true});
    }

    updateProfile(newProfile) {
        let url = new URL('updateUser', apiBaseURL);
        newProfile.id = this.cookies.get('userId');
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({user: newProfile})
        }
        fetch(url, options)
        .then(() => {
            this.componentDidMount()
            this.setState({editing: false})
        })
    }

    render() {
        if (this.state.invalid) {
            return <Redirect to='/home' />
        }
        //const { classes } = this.props;
        return (
            <div>
                <MenuBar pageName={'Profile'}/>
                {!this.state.editing &&
                    <InfoViewer user={this.state.user} edit={this.editButton}/>
                }
                {this.state.editing &&
                    <UserInfoForm user={this.state.user} callback={this.updateProfile} cancelCallback={_ => {
                        this.componentDidMount()
                        this.setState({editing: false})
                        }
                    }/>
                }
            </div>
        );
    }
}
export default withCookies(withStyles(styles, { withTheme: true })(Profile))