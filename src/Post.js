import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment';

import {getHeaders} from './utils';

class Post extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.model
        }

        console.log(this.state.post);

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

        let commentButton = null;
        if (post.comments.length > 1) {
            commentButton = <button className="link">View all {post.comments.length} comments</button>
        }
        
        let commentPreview = null;
        if (post.comments.length > 0) {
            const latestComment = post.comments.pop();
            console.log(latestComment)
            commentPreview = (
                <div className="comments">
                    <div>
                        <p><strong>{latestComment.user.username}</strong> {latestComment.text}</p>
                        <p class="timestamp">{latestComment.display_time}</p>
                    </div>
                </div>
            )
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
                    <div className="buttons">
                        <div>
                            <LikeButton 
                                postId={post.id} 
                                likeId={post.current_user_like_id}
                                requeryPost={this.requeryPost} />
                            <i className="far fa-comment"></i>
                            <i className="far fa-paper-plane"></i>
                        </div>
                        <div>
                            <BookmarkButton
                                postId={post.id}
                                bookmarkId={post.current_user_bookmark_id}
                                requeryPost={this.requeryPost} />
                        </div>
                    </div>
                    <p className="likes">
                        <strong>{(post.likes.length + " like" + (post.likes.length === 1 ? "" : "s"))}</strong>
                    </p>
                    <div className="caption">
                        <p><strong>{post.user.username}</strong>{post.caption}</p>
                        <p className="timestamp">{post.display_time}</p>
                    </div>
                    {commentButton}
                    {commentPreview}
                </div>
                <AddComment
                    postId={post.id}
                    requeryPost={this.requeryPost} />
            </section> 
        );     
    }
}

export default Post;