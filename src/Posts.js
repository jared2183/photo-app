import React from 'react';
import Post from './Post';
import {getHeaders} from './utils';

class Posts extends React.Component {  

    constructor(props) {
        super(props);
        this.state = { posts: [] };
        this.fetchPosts = this.fetchPosts.bind(this);
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts() {
        fetch('https://photo-app-secured.herokuapp.com/api/posts', {
                // authentication headers added using 
                // getHeaders() function from src/utils.js
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ posts: data });
            })
    }
    
    render () {
        return (
            <div id="posts">
                {
                    this.state.posts.map(post => {
                        if (post.likes) {
                            post.likes.forEach(like => {
                                if (like.user_id === 1) {
                                    post.current_user_like_id = like.id;
                                    return;
                                }
                            });
                        }

                        return (
                            <Post model={post} key={'post-' + post.id} />
                        )
                    })
                }
            </div>
        );     
    }
}

export default Posts;