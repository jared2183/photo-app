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
        console.log('Changed State: ', this.state.value)
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
            console.log('Submit State: ', this.state.value)
            // this.textInput.current.focus();
        })
    }

    render() {
        return (
            <div className="card-footer">
                <i className="far fa-smile"></i>
                <input type="text" id="comment" placeholder="Add a comment..." aria-label="Add a comment" onChange={this.handleChange} />
                    <button className="comment" post_id={this.props.postId} onClick={this.handleSubmit}>Post</button>
            </div>
        );
    }
}

export default AddComment;