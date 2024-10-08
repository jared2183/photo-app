import React from 'react';
import {getHeaders} from './utils';

class LikeButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleLike = this.toggleLike.bind(this);
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);

        this.iLiked = false;
    }

    toggleLike() {
        this.iLiked = true;
        
        if (this.props.likeId) {
            this.unlike();
        } else {
            this.like();
        }
    }

    like() {
        fetch(`https://photo-app-secured.herokuapp.com/api/posts/likes`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    post_id: this.props.postId
                })
            }).then(response => {
                if (response.ok) {
                    this.props.requeryPost();
                }
            })
        // issue fetch request and then afterwards requery for the post:
        // this.props.requeryPost();
    }

    unlike() {
        fetch(`https://photo-app-secured.herokuapp.com/api/posts/likes/` + this.props.likeId, {
            method: 'DELETE',
            headers: getHeaders(),
        }).then(response => {
            if (response.ok) {
                this.props.requeryPost();
            }
        })
    }

    render () {
        const likeId = this.props.likeId;
        const likedClass = this.iLiked ? 'iliked' : 'liked';

        return (
            <button
                role="switch"
                className="like" 
                aria-label="Like Button" 
                aria-checked={likeId ? true : false}
                onClick={this.toggleLike}>
                <i className={likeId ? 'fas fa-heart ' + likedClass : 'far fa-heart'}></i>                        
            </button>
        ) 
    }
}

export default LikeButton;