import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {  

    constructor(props) {
        super(props);

        console.log(props);

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        ReactDOM.render(
            '',
            document.getElementById('modal')
        )
    }

    render() {
        if (!this.props.model) {
            return (
                <div></div>
            );
        }

        return (
            <div className="modal-bg">
                <button id="#modal-close" className="close" aria-label="Close Modal" onClick={this.closeModal}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="modal" role="dialog" aria-live="assertive">
                    <img className="featured-image" src={this.props.model.image_url} />
                    <div className="container">
                        <h3>
                            <img className="pic" src={this.props.model.user.thumb_url} />
                            {this.props.model.user.username}
                        </h3>
                        <div className="body">
                            {this.props.model.comments.map(comment => {
                                return (
                                    <div key={`modal-comment-${comment.id}`}>
                                        <p><strong>{comment.user.username}</strong>{comment.text}</p>
                                        <p className="timestamp">{comment.display_time}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                </div>
            </div>
        )
    }
}

export default Modal;