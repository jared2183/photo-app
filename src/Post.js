import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import {getHeaders} from './utils';

class Post extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.model
        }

        this.requeryPost = this.requeryPost.bind(this);
    }

    requeryPost() {
        fetch(`https://photo-app-secured.herokuapp.com/api/posts/${this.state.post.id}`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                // @TODO: Remove
                if (data.likes) {
                    data.likes.forEach(like => {
                        if (like.user_id === 1) {
                            data.current_user_like_id = like.id;
                            return;
                        }
                    });
                }

                this.setState({ 
                    post: data
                });
            });
    }
    
    render () {
        const post = this.state.post;
        if (!post) {
            return (
                <div></div>  
            );
        }
        return (
            <section className="card">
                <div className="header">
                    <h3>{ post.user.username }</h3>
                    <i className="fa fa-dots"></i>
                </div>
                
                <img 
                    src={ post.image_url } 
                    alt={'Image posted by ' +  post.user.username } 
                    width="300" 
                    height="300" />
                
                <div className="info">
                    <div>
                        <LikeButton 
                            postId={post.id} 
                            likeId={post.current_user_like_id}
                            requeryPost={this.requeryPost} />
                        <BookmarkButton
                            postId={post.id}
                            bookmarkId={post.current_user_bookmark_id}
                            requeryPost={this.requeryPost} />
                    </div>
                    <p>{ post.caption }</p>
                </div>
            </section> 
        );     
    }
}

export default Post;