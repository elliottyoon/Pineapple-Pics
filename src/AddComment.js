import React from 'react'
import {getHeaders} from './utils'

class AddComment extends React.Component {
    
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.submitComment = this.submitComment.bind(this)
        this.addComment = this.addComment.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state
        this.textInput.current.focus();
    }

    submitComment( event ) {
        event.preventDefault()
        this.textInput.current.focus();
        const text = document.getElementById(this.props.postId + "-label").value;
        if (text !== '') {
            this.addComment(text);
            document.getElementById(this.props.postId + "-label").value = "";
            this.props.refreshPost();
        }
    }

    addComment(text) {
        const postData = {
            "post_id": this.props.postId,
            "text": text
        }

        fetch('/api/comments', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    }


    render() {
        return (
        <div className="add-comment">
            <label htmlFor={this.props.postId + "-label"}
                   style={{display: 'none'}}>Add a comment</label>
            <input type="text" placeholder="Add a comment..." 
                   id={this.props.postId + "-label"} ref={this.textInput}></input>
            <button className="link"
                    onClick={this.submitComment}
                    data-post-id={this.props.postId}>Post</button>
        </div>
    )}
}

export default AddComment;