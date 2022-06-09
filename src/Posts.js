import React from 'react'
import Post from './Post'

import {getHeaders} from './utils'

class Posts extends React.Component {
    
    constructor(props) {
        super(props);
        // initialization code goes here
        this.state = {
            posts: []
        }

        this.getPostsFromServer()
    }

    getPostsFromServer () {
        fetch('/api/posts', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                posts: data
            })
        })
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    render() {
        return (
            <div id="posts">
                {
                    this.state.posts.map(post => {
                        console.log(post);
                        return (
                            <Post 
                                key={'post_' + post.id}
                                model={post}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Posts;