import React, { Component } from 'react';
import {withCookies} from 'react-cookie'
import { withStyles } from '@material-ui/core/styles';
import { apiBaseURL } from '../App';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paperBox: {
    width: '100%',
    margin: 10
  },
  userRating: {
    padding: 25
  },
  ratingStars: {
    marginLeft: 25
  },
  submitButton: {
    margin: 15,
  }
});

class RatingComponent extends Component {
    constructor(props) {
        super(props)
        this.cookies = props.cookies;
        this.state = {
            groupObj: {},
            userProfiles:[],
            ratings: [3,3,3,3,3,3,3,3,3,3,3,3]
        }
        this.onChange = this.onChange.bind(this);
        this.submitRatings = this.submitRatings.bind(this);
    }

    componentDidMount() {
        let url = new URL('/groups', apiBaseURL);
        url.search = new URLSearchParams({id: this.props.groupId});
        fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            var members = []
            resp.group.members.forEach(member => {
              let profileUrl = new URL('/profile', apiBaseURL);
              profileUrl.search = new URLSearchParams({userId: member});
              fetch(profileUrl)
              .then(resp => resp.json())
              .then(resp => members.push(resp.user))
            })
            let arr = (new Array(members.length)).fill(3)
            this.setState({userProfiles: members, ratings: arr})            
        })
    }

    onChange(e, index) {
        let target = e.target;
        let r = this.state.ratings
        r[index] = target.value
        this.setState({ratings: r});
    }

    submitRatings() {
        let url = new URL('user/rating', apiBaseURL);
        for(var i = 0; i < this.state.ratings.length; i++) {
            if(this.state.userProfiles[i].id !== this.cookies.get('userId')){
              let options = {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({userId: this.state.userProfiles[i].id, rating: this.state.ratings[i]})
              }
             fetch(url, options)
            }
        }
        url = new URL('groups/rated', apiBaseURL);
        let options = {
          headers: {
              'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({userId: this.cookies.get('userId'), groupId: this.props.groupId})
        }
        fetch(url, options).then(resp =>
          window.location.reload()
        )
    }

    render() {
        const { classes } = this.props;
        return (
          <Paper className={classes.paperBox}>
              {this.state.userProfiles.map((profile, index) => 
                  <div key={index}>
                      { profile.id !== this.cookies.get('userId') && 
                          <FormGroup row className={classes.userRating}>
                              <Typography variant="h6">{profile.name}</Typography>
                              <Rating
                                  value={this.state.ratings[index]}
                                  className={classes.ratingStars}
                                  read-only={this.state.groupObj.rated.includes(this.cookies.get('userId'))}
                                  onChange={(e) => this.onChange(e, index)}/>
                          </FormGroup>
                      } 
                  </div>
              )}
              <Button variant="contained" color="primary" className={classes.submitButton} onClick={this.submitRatings}> Submit Ratings</Button>
          </Paper>
        );
    }
}

export default withCookies(withStyles(styles, { withTheme: true })(RatingComponent));