import React from 'react';
import NavBar from './NavBar';
import Posts from './Posts'
import Profile from './Profile'
import Stories from './Stories'
import Suggestions from './Suggestions'

import {getHeaders} from './utils'

class App extends React.Component {  

    constructor(props) {
        super(props);
            // issue a fetch request to /api/profile endpoint:
            this.getProfileFromServer();
            this.state = {
                user: {}
            };
    }

    getProfileFromServer () {
        fetch('/api/profile', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                user: data
            })
        })
    }

    render () {
        return (
            <div>

            <NavBar title="Pineapple Pics" 
                    username={this.state.user.username}/>

            <aside>
                <Profile username={this.state.user.username}
                         user_image={this.state.user.image_url}/>
                <Suggestions />
            </aside>

            <main className="content">
                <Stories />
                <Posts />
            </main>

            </div>
        );
    }
}

export default App;