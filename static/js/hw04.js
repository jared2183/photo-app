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
            <div>
                <h4 class="username">${user.username}</h4>
                <p>Suggested for you</p>
            </div>
            <button aria-label="Follow button" aria-checked="false" class="Follow" onClick=toggleFollow(event) data-user-id=${user.id}>Follow</button>
        </section>
    `;
}

const profile2Html = profile => {
    return `
        <div class="user">
            <img src="${profile.thumb_url}">
            <h1 class="username">${profile.username}</h1>
        </div>
        `
}

const comment2Html = comment => {
    return `
    <div class="card-comment">
        <h3>${comment.user.username}</h3>
        <p>${comment.text}</p>
    </div>
    <div class="timestamp">
        <h4>${comment.display_time}</h4>
    </div>
    `
}


// Posts

var posts = {}

const getPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(postsData => {
            postHTML = ""
            // loop through first 10 posts
            postsData.slice(0, 10).forEach(post => {
                postHTML += post2HTML(post)
                posts[post.id] = post
            });
            document.querySelector('#posts').innerHTML = postHTML;
        })
}

const post2HTML = (post) => {
    postHTML = ''
    post.current_user_like_id = getLikeID(post)
    post.current_user_bookmark_id = bookmarks[post.id]
    postHTML += post2Html_Head(post)
    comments = post.comments

    if (comments.length === 1) {
        postHTML += comment2Html(comments[0])
    }
    else if (comments.length > 1) {
        postHTML += `<button onClick="openModal(${post.id}, event)">View all ${comments.length} comments</button>`
        postHTML += comment2Html(comments[comments.length - 1])
    }

    postHTML += post2Html_Footer(post)
    postHTML += "\n"
    return postHTML
}

const post2Html_Head = post => {
    return `
    <div class="card" id="post-${post.id}" post_id=${post.id}>
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
            <div class="timestamp">
                <h4>${post.display_time}</h4>
            </div>
            <div class="card-comment-list">
    `
}


const post2Html_Footer = post => {
    return `
        </div>
        <div class="card-footer">
            <i class="far fa-smile"></i>
            <input type="text" id="comment" placeholder="Add a comment..." aria-label="Add a comment">
            <button class="comment" post_id="${post.id}" onClick=newComment(event)>Post</button>
        </div>
    </div>
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

    if (likeID != '0') { // Remove like
        fetch("/api/posts/likes/" + likeID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(data => {
            data.json().then(dataJSON => {
                if (data.ok) {
                    event.target.classList.remove('fas')
                    event.target.classList.remove('liked')
                    event.target.classList.add('far')
                    event.target.setAttribute('current_user_like_id', '0')

                    event.target.setAttribute('aria-checked', 'false')

                    oldLikes = event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML
                    oldLikes = parseInt(oldLikes.split(' ')[0]) - 1
                    event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML = oldLikes + " like" + (oldLikes == 1 ? "" : "s")
                } else {
                    console.error(dataJSON)
                }
            })
        });
    } else { // Add like
        const postData = {
            "post_id": postID
        };
        
        fetch("/api/posts/likes/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            })
            .then(data => {
                data.json().then(dataJSON => {
                    if (data.ok) {
                        event.target.classList.add('liked')
                        event.target.classList.add('fas')
                        event.target.classList.remove('far')
                        event.target.setAttribute('current_user_like_id', dataJSON.id)

                        event.target.setAttribute('aria-checked', 'true')

                        oldLikes = event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML
                        oldLikes = parseInt(oldLikes.split(' ')[0]) + 1
                        event.target.parentElement.parentElement.parentElement.querySelector("#likes").innerHTML = oldLikes + " like" + (oldLikes == 1 ? "" : "s")
                    } else {
                        console.error(dataJSON)
                    }
                })
            });
    }
}

function toggleBookmark(event) {
    bookmarkID = event.target.getAttribute('current_user_bookmark_id');
    postID = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('post_id');

    if (bookmarkID != '0') { // Remove bookmark
        fetch("/api/bookmarks/" + bookmarkID, {
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
        
        fetch("/api/bookmarks/", {
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

// Follow and Unfollow

const toggleFollow = event => {
    const elem = event.target;
    const userId = elem.dataset.userId;

    if (elem.innerHTML === "Follow") {
        elem.innerHTML = "Following..."
        createNewFollow(userId, elem)
    } else if (elem.innerHTML === "Unfollow") {
        elem.innerHTML = "Unfollowing..."
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

// Modal

const MODAL_COMMENT_HTML = (comment) => {
    return `<div class="modal-comment">
        <div class="modal-comment-left">
            <img src="${comment.user.thumb_url}">
        </div>

        <div class="modal-comment-center">
            <h3 class="modal-comment-author">${comment.user.username}</h3>
            <p class="modal-comment-text">${comment.text}</p>
            <br>
            <h4>${comment.display_time}</h4>
        </div>

        <div class="modal-comment-right">
            <i class="far fa-heart"></i>
        </div>
    </div>`
}

function closeModal() {
    document.getElementById('modal').classList.remove('modal-visible')
    document.getElementById('modal').setAttribute('arria-hidden', 'true')
    document.querySelector('body').style.overflow = 'auto'

    if (modalOpenedBy) {
        modalOpenedBy.focus()
    }
}

var modalOpenedBy = null

function openModal(postID, event) {
    document.getElementById('modal').classList.add('modal-visible');
    document.querySelector('body').style.overflow = 'hidden'

    console.log(postID)
    console.log(posts[postID])

    const post = posts[postID]

    modalOpenedBy = event.target

    document.getElementById('modal').setAttribute('aria-hidden', 'false')
    document.getElementById('modal-img').setAttribute('src', post.image_url)
    document.getElementById('modal-author').innerHTML = post.user.username
    document.getElementById('modal-author-img').setAttribute('src', post.user.thumb_url)

    // Reset modal comments
    document.getElementById('modal-comments').innerHTML = ''

    // Add caption to comments
    if (post.caption) {
        const caption = {
            user: post.user,
            text: post.caption,
            display_time: post.display_time
        }

        document.getElementById('modal-comments').innerHTML += MODAL_COMMENT_HTML(caption)
    }

    if (post.comments) {
        post.comments.forEach(comment => {
            document.getElementById('modal-comments').innerHTML += MODAL_COMMENT_HTML(comment)
        })
    }
}

// Comments

const newComment = (event) => {
    const elem = event.target;
    const parentElem = elem.parentElement
    const postId = elem.getAttribute('post_id');
    const commentText  = parentElem.querySelector('#comment').value;
    const commentRequest = {
        'post_id': postId,
        'text': commentText
    }

    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(commentRequest)
        })
    .then(data => {
        if (!data.ok) {
            console.error(data)
        }

        parentElem.querySelector('#comment').value = ''
        const postURL = `/api/posts/${postId}`
        fetch(postURL, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(postData => {
            html = post2HTML(postData)
            document.querySelector(`#post-${postId}`).outerHTML = html
            document.querySelector(`#post-${postId} #comment`).focus()
        })
    })
}

// Suggestions Panel

const getProfile = () => {
    fetch('/api/profile/')
        .then(response => response.json())
        .then(profile => {
            const html = profile2Html(profile);
            document.querySelector('.profile').innerHTML = html;
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
}

var bookmarks = {}

const initPage = () => {
    fetch("/api/profile/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        activeUser = data
    })

    fetch("/api/bookmarks/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(bookmarks_response => bookmarks_response.json())
    .then(bookmarks_data => {
        for (let i = 0; i < bookmarks_data.length; i++) {
            bookmarks[bookmarks_data[i].post.id] = bookmarks_data[i].id
        }
    })
        
    displayStories();
    getProfile();
    getSuggestion();
    getPosts();
};

const modalElement = document.getElementById('modal');
document.addEventListener('focus', function(event) {
    console.log('focus');
    if (modalElement.getAttribute('aria-hidden') === 'false' && !modalElement.contains(event.target)) {;
        event.stopPropagation();
        document.querySelector('#modal-close').focus();
    }
}, true);

// on escape key, close modal
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
        closeModal();
    }
});

// invoke init page to display stories:
initPage();