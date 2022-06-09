import React from 'react';
import ReactDOM from 'react-dom';

import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment';
import Modal from './Modal';

import {getHeaders} from './utils';

class Post extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.model
        }

        // console.log(this.state.post);

        this.requeryPost = this.requeryPost.bind(this);
        this.openModal = this.openModal.bind(this);
        this.skipAnim = true;
    }

    requeryPost() {
        this.skipAnim = false;
        fetch(`https://photo-app-secured.herokuapp.com/api/posts/${this.state.post.id}`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ 
                    post: data
                });
            });
    }

    openModal() {
        ReactDOM.render(
            <Modal model={this.state.post} />,
            document.getElementById('modal')
        )
    }
    
    render() {
        const post = this.state.post;

        if (!post) {
            return (
                <div></div>  
            );
        }

        if (!this.skipAnim) {
            setTimeout(() => {
                this.skipAnim = true;
                this.setState({
                    post: this.state.post
                })
            }, 500);
        }

        let commentButton = null;
        if (post.comments.length > 1) {
            commentButton = <button
                className="link"
                onClick={this.openModal}>
                    View all {post.comments.length} comment
            </button>
        }
        
        let commentPreview = null;
        if (post.comments.length > 0) {
            const latestComment = post.comments[post.comments.length - 1];
            // console.log(latestComment)
            commentPreview = (
                <div className="comments">
                    <div>
                        <p><strong>{latestComment.user.username}</strong> {latestComment.text}</p>
                        <p className="timestamp">{latestComment.display_time}</p>
                    </div>
                </div>
            )
        }

        return (
            <section key={`post-${post.id}`} className={`card${this.skipAnim ? '' : ' card-update-anim'}`}>
                <div className="header">
                    <h3>{ post.user.username }</h3>
                    <i className="fa fa-dots"></i>
                </div>
                
                <img 
                    src={ post.image_url } 
                    alt={'Image posted by ' +  post.user.username } 
                    width="300" 
                    height="300" />
                
                <div className="buttons">
                    <div>
                        <span>
                            <LikeButton 
                                postId={post.id} 
                                likeId={post.current_user_like_id}
                                requeryPost={this.requeryPost}>
                            </LikeButton>
                            <strong className={this.skipAnim ? 'like-button' : 'like-button likeAnim'}>{(post.likes.length)}</strong>
                        </span>
                        <span>                            
                            <i className="far fa-comment"></i>
                            <i className="far fa-paper-plane"></i>
                        </span>
                    </div>

                    <div>
                        <BookmarkButton
                            postId={post.id}
                            bookmarkId={post.current_user_bookmark_id}
                            requeryPost={this.requeryPost} />
                    </div>
                </div>

                <div className="info">
                    {/* <p className="likes">
                        <strong>{(post.likes.length + " like" + (post.likes.length === 1 ? "" : "s"))}</strong>
                    </p> */}

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