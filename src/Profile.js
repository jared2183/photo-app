import React from 'react';

class Profile extends React.Component {  

    constructor(props) {
        super(props);
        console.log(props);
    }

    componentDidMount() {
        // fetch posts
    }

    render () {
        let now = new Date();

        let greeting = "Good ";
        if (now.getHours() < 12) {
            greeting += "Morning";
        } else if (now.getHours() < 18) {
            greeting += "Afternoon";
        } else {
            greeting += "Evening";
        }
        greeting += ", " + this.props.profile.first_name + ".";


        return (
            <header>
                <div>
                    <img className="pic" src={this.props.profile.thumb_url} alt="Profile" />
                    <div>
                        <h1>{this.props.profile.username}</h1>
                        <p>{greeting}</p>
                    </div>
                </div>
            </header>  
        );
    }
}

export default Profile;