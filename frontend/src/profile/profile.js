import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from '../App';
import UserContext from '../UserContext';
import UserInfoForm from './userInfoForm';
import InfoViewer from './infoViewer';
import { Redirect } from 'react-router-dom';
import MenuBar from '../global-components/menuBar';

const styles = theme => ({
});

class Profile extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            user: {},
            invalid: false,
        };
        this.editButton = this.editButton.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        let url = new URL('profile', apiBaseURL);
        url.search = new URLSearchParams({userId: this.context.userId}).toString();
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
        newProfile.id = this.context.userId;
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
                    <UserInfoForm user={this.state.user} callback={this.updateProfile} />
                }
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(Profile)