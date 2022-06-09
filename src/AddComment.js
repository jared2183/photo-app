import React from 'react';
import { getHeaders } from './utils';

class AddComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.textInput = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let commentRequest = {
            post_id: this.props.postId,
            text: this.state.value
        }

        fetch(`https://photo-app-secured.herokuapp.com/api/comments`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(commentRequest)
        })
            .then(data => {
                if (data.ok) {
                    this.props.requeryPost();
                }
            })
            .then(() => {
                this.setState({ value: '' });
                this.textInput.current.focus();
            })
    }

    render() {
        return (
            <form className="add-comment">
                <div className="input-holder">
                    <input type="text" className="comment-textbox" aria-label="Add a comment" placeholder="Add a comment..." 
                    value={this.state.value} onChange={this.handleChange} ref={this.textInput}>
                    </input>
                </div>
                <button className="link" onClick={this.handleSubmit}>Post</button>
            </form>
        );
    }
}

export default AddComment;