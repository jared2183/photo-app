import React from 'react';

class NavBar extends React.Component {  

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // fetch posts
    }

    render () {
        return (
            <nav className="main-nav">
                <h1>Photo App</h1>
                <ul>   
                    <li><a href="/api">API Docs</a></li>
                    <li><span>{this.props.profile.username}</span></li>
                    <li><a href="/logout">Sign out</a></li>
                </ul> 
            </nav>       
        );
    }
}

export default NavBar;