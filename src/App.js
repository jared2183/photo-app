import React from 'react';
import {getHeaders} from './utils';

import NavBar from './NavBar';
import Profile from './Profile';
import Stories from './Stories';
import Suggestions from './Suggestions';
import Posts from './Posts';

class App extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile
        }

        this.fetchProfile = this.fetchProfile.bind(this);
    }

    componentDidMount() {
        this.fetchProfile();
    }

    fetchProfile() {
        fetch(`https://photo-app-secured.herokuapp.com/api/profile/`, {
            method: 'GET',
            headers: getHeaders(),
        }).then(response => {
            if (response.ok) {
                response.json().then(profile => {
                    this.setState({ profile: profile });
                });
            }
        })
    }

    render () {
        const profile = this.state.profile

        if (!profile) {
            return (
                <div></div>
            );
        }

        return (
            <div>
                <NavBar profile={profile}/>
                <aside>
                    <Profile profile={profile}/>
                    <Suggestions profile={profile}/>
                </aside>

                <main className="content">
                    <Stories />
                    <Posts />
                </main>
            </div>
        );
    }
}

export default App;