import React from 'react'
import Suggestion from './Suggestion'
import {getHeaders} from './utils'

class Suggestions extends React.Component {
    
    constructor(props) {
        super(props);
        // initialization code goes here
        this.state = {
            suggestions: []
        }

        this.getSuggestionsFromServer = this.getSuggestionsFromServer.bind(this);
        this.getSuggestionsFromServer()
    }

    getSuggestionsFromServer() {
        fetch('/api/suggestions', {
            method: "GET",
            headers: getHeaders()
        }).then(response => response.json())
        .then( data => {
            this.setState({
                suggestions: data
            })
        })
    }

    componentDidMount() {
        // fetch posts and then set the state
    }


    render() {
        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                <div>
                    {
                        this.state.suggestions.map(suggestion => {
                            return (
                                <Suggestion 
                                    key={'suggestions_' + suggestion.id} 
                                    model={suggestion}
                                    refreshSuggestions={this.getSuggestionsFromServer}/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Suggestions;