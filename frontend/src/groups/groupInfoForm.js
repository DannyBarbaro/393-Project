import React from 'react';

export default class GroupInfoForm extends React.Component {

    constructor(props) {
        super(props);
        this.callback = props.submit;
        this.state = {
            name: '',
            eventName: 'Superb Owl',
            eventId: '5dd9c9aee4b9b13f41d9fa8d', //TODO hardcoded for a single event
            visibility: 'public',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        let target = e.target;
        this.setState({[target.name]: target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        this.callback(this.state);
    }

    render() {
        return (
            //TODO a lot of these should probably become dropdowns
            <form onSubmit={this.onSubmit}>
                <label>
                    Group Name
                    <input name="name" onChange={this.onChange} value={this.state.name} />
                </label>
                <br />
                <label>
                    Event Name
                    {/*TODO undisable this button*/}
                    <input name="eventName" disabled onChange={this.onChange} value={this.state.eventName} />
                </label>
                <br />
                <label>
                    Visibility
                    <input name="visibility" onChange={this.onChange} value={this.state.visibility} />
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}