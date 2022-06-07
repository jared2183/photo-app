import React from 'react';
import { getHeaders } from './utils';

class NavBar extends React.Component {  

    constructor(props) {
        super(props);

        this.props.model.following_id = null;
        this.state = {
            suggestion: this.props.model
        }

        // console.log('suggestion', this.state.suggestion);
        this.toggleFollowing = this.toggleFollowing.bind(this);
    }

    toggleFollowing() {
        console.log('toggleFollowing');
        if (this.state.suggestion.following_id) {
            this.unfollow();
        } else {
            this.follow();
        }
    }

    follow() {
        fetch("https://photo-app-secured.herokuapp.com/api/following/", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({user_id: this.state.suggestion.id})
        }).then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    this.setState({ suggestion: {...this.state.suggestion, following_id: responseJson.id} });
                });
            }
        })
    }

    unfollow() {
        fetch("https://photo-app-secured.herokuapp.com/api/following/" + this.state.suggestion.following_id, {
            method: "DELETE",
            headers: getHeaders()
        }).then(response => {
            if (response.ok) {
                this.setState({ suggestion: {...this.state.suggestion, following_id: null} });
            }
        })
    }

    render () {
        const suggestion = this.state.suggestion;

        // console.log('suggestion rerendered', suggestion.following_id);

        return (
            <section>
                <img className="pic" src={suggestion.thumb_url} alt="Profile" />
                <div>
                    <p>{suggestion.username}</p>
                    <p>suggested for you</p>
                </div>
                <div>
                    <button role="switch"
                        className={`link following ${suggestion.following_id ? 'active' : ''}`}
                        aria-label={`Follow ${suggestion.username}`}
                        aria-checked={suggestion.following_id}
                        onClick={this.toggleFollowing}>
                        {suggestion.following_id ? 'unfollow' : 'follow'}
                    </button>
                </div>
            </section>
        )
    }
}

export default NavBar;