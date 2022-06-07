import React from 'react';

class Profile extends React.Component {  

    constructor(props) {
        super(props);
        // constructor logic
    }

    componentDidMount() {
        // fetch posts
    }

    render () {
        return (
            <header>
                <div>
                    <img class="pic" src={this.props.profile.thumb_url} alt="Profile" />
                    <h1>{this.props.profile.username}</h1>
                </div>
            </header>  
        );
    }
}

export default Profile;