import React from 'react';
import { getHeaders } from './utils';

import Suggestion from './Suggestion';

class Suggestions extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            suggestions: this.props.suggestions
        }

        this.fetchSuggestions = this.fetchSuggestions.bind(this);
    }

    fetchSuggestions() {
        fetch("https://photo-app-secured.herokuapp.com/api/suggestions/", {
            method: "GET",
            headers: getHeaders()
        }).then(response => {
            if (response.ok) {
                response.json().then(suggestions => {
                    this.setState({ suggestions: suggestions });
                });
            }
        })
    }

    componentDidMount() {
        this.fetchSuggestions();
    }

    render () {
        const suggestions = this.state.suggestions

        if (!suggestions) {
            return (
                <div></div>
            );
        }

        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                {
                    suggestions.map(suggestion => {
                        return (
                            <Suggestion model={suggestion} key={'suggestion-' + suggestion.id} />
                        )
                    })
                }
            </div>
        )     
    }
}

export default Suggestions;