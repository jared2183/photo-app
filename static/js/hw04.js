const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const user2Html = user => {
    return `
        <div>
            <img src="${user.thumb_url}">
            <div>
                <p class="username">${user.username}</p>
                <p class="suggestion-text">Suggestions for you</p>
            </div>
        </div>
        <button class="Follow" onClick=toggleFollow(event) data-user-id=${user.id}>Follow</button>
    `;
}

const toggleFollow = event => {
    console.log(event);
    const elem = event.currentTarget;
    const userId = elem.dataset.userId;

    if (elem.innerHTML === "Follow") {
        elem.innerHTML = "Unfollow"
        createNewFollow(userId, elem)
    }
    else {
        elem.innerHTML = "Follow"
        console.log(elem.dataset)
        deleteFollower(elem.dataset.followingId, elem)
    }               
}

const createNewFollow = (userId, elem) => {
    const postData = {
        'user_id': userId
    }

    fetch('/api/following', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(postData)
    })

    .then(response => response.json)
        .then(data => {
            elem.innerHTML = 'Unfollow'
            elem.classList.add('Unfollow')
            elem.classList.remove('Follow')
            elem.setAttribute('data-following-id', data.id)
        })
}   

const deleteFollower = (followerId, elem) => {
    const deleteURL = `/api/following/${followerId}`
    fetch(deleteURL, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        elem.innerHTML = 'Follow'
        elem.classList.add('Follow')
        elem.classList.remove('Unfollow')
        elem.setAttribute('data-following-id', data.id)
    })
}

const getSuggestion = () => {
    fetch('/api/suggestions/')
        .then(response => response.json())
        .then(users => {
            // combines all user html files into one variable
            const html = users.map(user2Html).join('\n');
            document.querySelector('.suggestions').innerHTML = html;
        })
}

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const initPage = () => {
    displayStories();
    getSuggestion();
};

// invoke init page to display stories:
initPage();