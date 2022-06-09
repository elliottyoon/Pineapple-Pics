import React from 'react'
import {getHeaders} from './utils'

class LikeButton extends React.Component {
    
    constructor(props) {
        super(props);

        // binding "this"
        this.toggleLike = this.toggleLike.bind(this);
        this.createLike = this.createLike.bind(this);
        this.removeLike = this.removeLike.bind(this)

    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    toggleLike () {
        if (this.props.likeId) {
            this.removeLike();
        } else {
            this.createLike();
        }

    }

    createLike () {
        // fetch POST: /api/post/likes
        const url = '/api/posts/likes';
        const postData = {post_id: this.props.postId}
        console.log('create like: ', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => {
            // this needs to trigger a post redraw
            this.props.refreshPost();

            console.log(data);
        })
    }

    removeLike () {
        // fetch DELETE: /api/post/likes/{likeId}
        const url = '/api/posts/likes/' + this.props.likeId;
        console.log('remove like: ', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'DELETE'
        }).then(response => response.json())
        .then(data=> {
            // this needs to trigger a posts redraw
            this.props.refreshPost();

            console.log(data)

        })
    }

    render() {
        const likeId = this.props.likeId
        let heartClass = likeId ? 'fas' : 'far';
        return (
            <button 
                onClick={this.toggleLike}
                aria-label="Like / Unlike"
                aria-checked={likeId ? 'true' : 'false'}>
                <i className={heartClass + ' fa-heart fa-lg'}></i>
            </button>
        )
    }
}

export default LikeButton;