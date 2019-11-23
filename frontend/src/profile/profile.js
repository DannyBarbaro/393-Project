import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from "../App";
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
                    <UserInfoForm
                        user={this.state.user}
                        canceledCallback={_ => this.setState({editing: false})}
                        callback={new_user => this.setState({editing: false, user: new_user})} />
                }
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(Profile)