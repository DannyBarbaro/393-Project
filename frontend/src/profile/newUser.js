import React from "react"
import { Typography } from "@material-ui/core"
import UserInfoForm from "./userInfoForm"
import {Redirect} from 'react-router-dom'

export default class NewUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            completed: false
        }
        if (!!this.props.location) {
            this.userEmail = this.props.location.state.email;
        }
    }

    render() {
        if (this.state.completed) {
            return <Redirect to='/profile' />
        }
        return (
            <div>
                <Typography variant="h1">
                    Welcome!
                </Typography>
                <Typography variant="body1">
                    Please enter your information so we can create your account.
                </Typography>
                <UserInfoForm user={{email: this.userEmail}} newUser
                    callback={() => this.setState({completed: true})}/>
            </div>
        )
    }
}