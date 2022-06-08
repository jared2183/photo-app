import React from 'react';
import { getHeaders } from './utils';

class Story extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            story: this.props.model,
        }
    }

    render () {
        const story = this.state.story;

        return (
            <div className="story">
                <img src={story.user.thumb_url} className="pic" alt="profile pic" />
                <p>{story.user.username}</p>
            </div>
        )
    }
}


class Stories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stories: [],
        }
        this.fetchStories = this.fetchStories.bind(this);
    }

    componentDidMount() {
        this.fetchStories();
    }

    fetchStories() {
        fetch(`https://photo-app-secured.herokuapp.com/api/stories/`, {
            method: 'GET',
            headers: getHeaders(),
        }).then(response => {
            if (response.ok) {
                response.json().then(stories => {
                    this.setState({ stories: stories });
                });
            }
        })
    }

    story2HTML(story) {
        console.log('Story: ', story);
        console.log('Username: ', story.user.username)
        return (
            <div className="story">
                <img src={story.user.thumb_url} className="pic" alt="profile pic" />
                <p>{story.user.username}</p>
            </div>
        );
    }

    render() {
        const stories = this.state.stories;
        return (
            <header className="stories">
            {
                stories.map(story => {
                    return (
                        <Story model={story} key={'story-' + story.id} />
                    )
                })
            }
            </header>
        );
    }
}

export default Stories;