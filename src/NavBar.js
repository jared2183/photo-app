import React from 'react';

class NavBar extends React.Component {  

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        // fetch posts
    }

    render () {
        return (
            <nav>
                <h1>Photo App</h1>
                <ul>   
                    <li><a href="/api">API Docs</a></li>
                    <li>
                        <img className="pic" src={this.props.profile.thumb_url} alt="Profile" />
                        <span>{this.props.profile.username}</span>
                    </li>
                    <li><a href="/logout">Sign out</a></li>
                </ul> 
            </nav>       
        );
    }
}

export default NavBar;