import React from 'react'

class NavBar extends React.Component {
    
    constructor(props) {
        super(props);
        console.log(props)
    }

    componentDidMount() {
        // fetch posts and then set the state
    }

    render() {
        return (
            <nav className="main-nav">
                <h1>{this.props.title}</h1>
                <ul>
                    <li><a href="/">API Docs</a></li>
                    <li><div>{ this.props.username }</div></li>
                    <li><a href="/">Log Out</a></li>
                </ul>
                
            </nav>
        )
    }
}

export default NavBar;