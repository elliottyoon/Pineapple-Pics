import React from 'react'

class Profile extends React.Component {
    
    constructor(props) {
        super(props);
        console.log(props)
        // initialization code goes here
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    render() {
        return (
            <header>
                <section id="user-card">
                    <img className="rounded" src={this.props.user_image} alt=""/>
                    <h2>{this.props.username}</h2>
                </section>

            </header>
        )
    }
}

export default Profile;