var activeUser = null

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
        <section>
            <img src="${user.thumb_url}">
            <p class="username">${user.username}</p>
            <button aria-label="Follow button" aria-checked="false" class="Follow" onClick=toggleFollow(event) data-user-id=${user.id}>Follow</button>
        </section>
    `;
}

const profile2Html = profile => {
    return `
        <div>
            <img src="${profile.thumb_url}">
            <div>
                <p class="username">${profile.username}</p>
            </div>
        </div>    
        `;
}

// Posts 

const getPosts = () => {
    console.log("getPosts")
    console.log("making sure active user is set", activeUser)
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            postHTML = ""
            // loop through first 10 posts
            posts.slice(0, 10).forEach(post => {
                post.current_user_like_id = getLikeID(post)
                post.current_user_bookmark_id = bookmarks[post.id]
                postHTML += post2Html_Head(post)

                if (post.comments.length > 0) {
                    postHTML += post2Html_Comment(post.comments[0])
                }

                if (post.comments.length > 1) {
                    postHTML += `<button>View all ${post.comments.length} comments</button>`
                }

                postHTML += post2Html_Footer(post)

                postHTML += "\n"
            });
            
            console.log('getPosts html', posts)
            document.querySelector('#posts').innerHTML = postHTML;
        })
}

const post2Html_Head = post => {
    return `
    <div class="card" post_id=${post.id}>
        <div class="card-header">
            <h1>${post.user.username}</h1>
            <h1>···</h1>
        </div>
        <img src="${post.image_url}" alt="${post.user.username}'s posted image">
        <div class="card-body">
            <div class="card-buttons">
                <div class="card-left-buttons">
                    <button aria-checked="${post.current_user_like_id != '0'}" aria-label="Like button" class="${post.current_user_like_id ? "fas liked" : "far"} fa-heart" current_user_like_id="${post.current_user_like_id}" onClick=toggleLike(event)></button>
                    <button class="far fa-comment"></button>
                    <button class="far fa-paper-plane"></button>
                </div>
                <div>
                    <button aria-checked="${post.current_user_bookmark_id != '0'}" aria-label="Bookmark button" class="${post.current_user_bookmark_id ? "fas" : "far"} fa-bookmark" current_user_bookmark_id="${post.current_user_bookmark_id ? post.current_user_bookmark_id : 0}" onClick=toggleBookmark(event)></button>
                </div>
            </div>
            <h2 id="likes">${post.likes.length} likes</h2>
            <div class="card-desc">
                <h3>${post.user.username}</h3>
                <p>${post.caption}</p>
                <button>more</button>
            </div>
            <div class="card-comment-list">
    `
}

const post2Html_Comment = comment => {
    return `
    <div class="card-comment">
        <h3>${comment.user.username}</h3>
        <p>${comment.text}</p>
    </div>
    `
}

const post2Html_Footer = post => {
    return `
    </div>
        <h4>${post.display_time}</h4>
    </div>
    <form class="card-footer">
        <i class="far fa-smile"></i>
        <input type="text" id="comment" placeholder="Add a comment..." aria-label="Add a comment">
        <button>Post</button>
    </form>
    </div>
    `
}

function getLikeID(post) {
    for (let i = 0; i < post.likes.length; i++) {
        if (post.likes[i].user_id === activeUser.id) {
            return post.likes[i].id
        }
    }

    return 0
}

const toggleLike = event => {
    likeID = event.target.getAttribute('current_user_like_id');
    postID = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('post_id');

    // console.log(postID)

    if (likeID != '0') { // Remove like
        fetch("http://127.0.0.1:5000/api/posts/likes/" + likeID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(data => {
            data.json().then(dataJSON => {
                if (data.ok) {
                    console.log("databoy", dataJSON)
                    event.target.classList.remove('fas')
                    event.target.classList.remove('liked')
                    event.target.classList.add('far')
                    event.target.setAttribute('current_user_like_id', '0')

                    event.target.setAttribute('aria-checked', 'false')

                    oldLikes = event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML
                    oldLikes = parseInt(oldLikes.split(' ')[0]) - 1
                    event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML = oldLikes + " like" + (oldLikes == 1 ? "" : "s")
                } else {
                    console.log(dataJSON)
                }
            })
        });
    } else { // Add like
        const postData = {
            "post_id": postID
        };
        
        fetch("http://127.0.0.1:5000/api/posts/likes/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            })
            .then(data => {
                data.json().then(dataJSON => {
                    if (data.ok) {
                        console.log("databoy", dataJSON)
                        event.target.classList.add('liked')
                        event.target.classList.add('fas')
                        event.target.classList.remove('far')
                        event.target.setAttribute('current_user_like_id', dataJSON.id)

                        event.target.setAttribute('aria-checked', 'true')

                        oldLikes = event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML
                        oldLikes = parseInt(oldLikes.split(' ')[0]) + 1
                        event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML = oldLikes + " like" + (oldLikes == 1 ? "" : "s")
                    } else {
                        console.log(dataJSON)
                    }
                })
            });
    }
}

function toggleBookmark(event) {
    bookmarkID = event.target.getAttribute('current_user_bookmark_id');
    postID = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('post_id');

    console.log("toggleBookmark postID", postID)

    if (bookmarkID != '0') { // Remove bookmark
        fetch("http://127.0.0.1:5000/api/bookmarks/" + bookmarkID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                event.target.classList.remove('fas')
                event.target.classList.add('far')
                event.target.setAttribute('current_user_bookmark_id', '0')

                event.target.setAttribute('aria-checked', 'false')
            } else {
                console.error(response)
            }
        });
    } else { // Add bookmark
        const postData = {
            "post_id": postID
        };
        
        fetch("http://127.0.0.1:5000/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    event.target.classList.add('fas')
                    event.target.classList.remove('far')
                    event.target.setAttribute('current_user_bookmark_id', data.id)

                    event.target.setAttribute('aria-checked', 'true')

                    bookmarks[postID] = data.id
                })
            } else {
                console.error(response)
            }
        });
    }
}

// Follow and Unfollow buttons
const toggleFollow = event => {
    const elem = event.target;
    const userId = elem.dataset.userId;

    if (elem.innerHTML === "Follow") {
        elem.innerHTML = "Following..."
        console.log(elem.dataset)
        createNewFollow(userId, elem)
    } else if (elem.innerHTML === "Unfollow") {
        elem.innerHTML = "Unfollowing..."
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

    .then(response => response.json())
        .then(data => {
            elem.innerHTML = 'Unfollow'
            elem.classList.add('Unfollow')
            elem.classList.remove('Follow')
            elem.setAttribute('aria-checked', 'true')
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
        elem.setAttribute('aria-checked', 'false')
        elem.setAttribute('data-following-id', data.id)
    })
}

// Suggestions Panel
const getProfile = () => {
    fetch('/api/profile/')
        .then(response => response.json())
        .then(user => {
            const html = user2Html(user);
            document.querySelector('.suggestions').innerHTML = html;
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

// fetch data from your API endpoint for stories:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

var bookmarks = {}

const initPage = () => {
    fetch("http://127.0.0.1:5000/api/profile/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        activeUser = data;

        fetch("http://127.0.0.1:5000/api/bookmarks/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(bookmarks_response => bookmarks_response.json())
        .then(bookmarks_data => {
            console.log("bookymarkies", bookmarks_data);

            for (let i = 0; i < bookmarks_data.length; i++) {
                bookmarks[bookmarks_data[i].post.id] = bookmarks_data[i].id
            }

            console.log("bookymen!", bookmarks);
        
            displayStories();
            getSuggestion();
            getPosts();
        });
    });
};

// invoke init page to display stories:
initPage();