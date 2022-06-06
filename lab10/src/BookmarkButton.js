import React from 'react';
import {getHeaders} from './utils';

class BookmarkButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.bookmark = this.bookmark.bind(this);
        this.unbookmark = this.unbookmark.bind(this);
    }

    toggleBookmark(ev) {
        if (this.props.bookmarkId) {
            console.log('unbookmark');
            this.unbookmark();
        } else {
            console.log('bookmark');
            this.bookmark();
        }
    }

    bookmark() {
        fetch(`/api/bookmarks`, {
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

    unbookmark() {
        fetch(`/api/bookmarks/` + this.props.bookmarkId, {
            method: 'DELETE',
            headers: getHeaders(),
        }).then(response => {
            if (response.ok) {
                this.props.requeryPost();
            }
        })
    }

    render () {
        const bookmarkId = this.props.bookmarkId;
        return (
            <button role="switch"
                className="bookmark" 
                aria-label="Bookmark Button" 
                aria-checked={bookmarkId ? true : false}
                onClick={this.toggleBookmark}>
                <i className={bookmarkId ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>                        
            </button>
        ) 
    }
}

export default BookmarkButton;