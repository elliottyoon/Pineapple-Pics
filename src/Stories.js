import React from 'react'
import {getHeaders} from './utils'

class Stories extends React.Component {
    
    constructor(props) {
        super(props);
        // initialization code goes here
        this.state = {
            stories: []
        }
        this.getStoriesFromServer();
    }

    getStoriesFromServer() {
        fetch('/api/stories', {
            method: "GET",
            headers: getHeaders()
        }).then(response => response.json())
        .then( data => {
            console.log(data)
            this.setState({
                stories: data
            })
        })
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    render() {
        return (
            <header className="stories">
                {
                    this.state.stories.map(story => {
                        return (
                            <div key={'stories_' + story.id}>
                                <img src={story.user.thumb_url} 
                                    className="pic"
                                    alt="" />
                                <p>{story.user.username}</p>
                            </div>
                        )
                    })
                }
            </header>
        )
    }
}

export default Stories;