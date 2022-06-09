import React from 'react'
import LikeButton from './LikeButton'
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment'
import {getHeaders} from './utils'

class Post extends React.Component {
    
    constructor(props) {
        super(props);
        // initialization code goes here
        this.state = {
            post: props.model
        }
        
        this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this);
        this.displayComments = this.displayComments.bind(this)
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    displayComments() {
        const post = this.state.post
        const comments = post.comments 
        console.log(comments)
        if (comments.length > 1) {
            return (
                <div className="comments">
                    <button data-post-id={post.id}
                            className="link">
                        View all {comments.length} comments
                    </button>
                    <p><b>{comments[comments.length - 1].user.username}</b> {comments[comments.length - 1].text}</p>
                </div>
                
            )
        }
        else if (comments.length === 1) {
            return (
                <div className="comments">
                    <p><b>{comments[comments.length - 1].user.username}</b> {comments[comments.length - 1].text}</p>
                </div>
                
            )
        }
    }

    refreshPostDataFromServer () {
        // refetch the post:
        const url = '/api/posts/' + this.state.post.id;
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            this.setState({
                post: data
            })
        })
    }

    render() {
        const post = this.state.post;
        return (
            <section 
                className="card"
                key={'post_' + post.id}>
                <div className="header">
                    <h3>{ post.user.username }</h3>
                    <i className="fa fa-dots"></i>
                </div>
                <img src={post.image_url} 
                     alt={'Image posted by ' + post.user.username }
                     width="300"
                     height="300"/>

                <div className="info">
                    <div className="post-buttons">
                        <LikeButton 
                            likeId={post.current_user_like_id}
                            postId={post.id}
                            refreshPost={this.refreshPostDataFromServer}/>
                        <button className="bt-comment">
                            <i className="far fa-comment fa-lg"></i>
                        </button>
                        <button className="bt-message">
                            <i className="far fa-paper-plane fa-lg"></i>
                        </button>
                        <BookmarkButton
                            id="end" 
                            bookmarkId={post.current_user_bookmark_id}
                            postId={post.id}
                            refreshPost={this.refreshPostDataFromServer}/>
                    </div>
                    <p>{post.caption}</p>
                    { this.displayComments() }
                    <p className="timestamp">{post.display_time}</p>
                    
                </div>
                <AddComment 
                        postId={post.id}
                        refreshPost={this.refreshPostDataFromServer}/>
            </section>
        )
    }
}

export default Post;