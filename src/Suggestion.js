import React from 'react'
import {getHeaders} from './utils'

class Suggestion extends React.Component {
    
    constructor(props) {
        super(props);
        // initialization code goes here
        this.state = {
            suggestion: props.model
        }

        this.toggleFollow = this.toggleFollow.bind(this)

        
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    toggleFollow () {
        const url = "/api/following"
        const postData = { user_id: this.props.model.id }
        console.log('following: ', url)
        fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => {
            this.props.refreshSuggestions();
        })
    }

    render() {
        const suggestion = this.state.suggestion;
        return (
            <section 
                className="recommendation-card"
                key={'suggestion_' + suggestion.id}>
                <img className="rounded" src={suggestion.thumb_url} alt=""/>
                <div className="recommended-username">
                    <p className="username">{suggestion.username}</p>
                    <p className="suggested-for-you">suggested for you</p>
                </div>
                <div>
                    <button 
                        className="link"
                        aria-label="Follow"
                        aria-checked="false"
                        data-user-id={suggestion.id}
                        onClick={this.toggleFollow}
                    >follow</button>
                </div>
            </section>
        )
    }
}

export default Suggestion;