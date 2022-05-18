/*





Do not forget to update like count
stupid












































*/
const toggleFollow = ev => {
    const elem = ev.currentTarget;

    if (elem.getAttribute('aria-checked') === 'false') {
        followUser(elem.dataset.userId, elem);      
    }
    else {
        unfollowUser(elem.dataset.followingId, elem);
    }
}

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("http://127.0.0.1:5000/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'unfollow';

        elem.setAttribute('aria-checked', 'true');
        
        elem.classList.add('unfollow');
        elem.classList.remove('follow');
        // in the event that we want to unfollow
        elem.setAttribute('data-following-id', data.id);
    });
};

const unfollowUser = (followingId, elem) => {
    const deleteURL = `http://127.0.0.1:5000/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        elem.innerHTML = 'follow';
        elem.classList.add('follow');
        elem.classList.remove('unfollow'); 
        elem.removeAttribute('data-following-id', data.id);
        elem.setAttribute('aria-checked', 'false');
    })
    
}

const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const user2Html = user => {
    return `<section>
        <img src="${user.thumb_url}" alt="" class="pic">
        <div>
            <p>${user.username}</p>
            <p>Suggested for you</p>
        </div>
        <div>
            <button 
                class="follow" 
                aria-label="Follow"
                aria-checked="false"
                data-user-id="${user.id}" 
                onclick="toggleFollow(event);">follow</button>
        </div>
    </section>`;
}

const displayUserProfile = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            //console.log(profile);
            const html = `<img src="${profile.image_url}" class="pic">
                          <h1>${profile.username}</h1>`;
            document.querySelector('header').innerHTML = html;
        })
};

const displaySuggestions = () => {
    fetch('/api/suggestions')
        .then(response => response.json())
        .then(users => {
            console.log(users);
            const html = `<div class="suggestion-text">Suggestions for you</div>` + users.map(user2Html).join('\n');
            document.querySelector('.suggestions').innerHTML = html;
        })
};

card2Html = card => {
    let numComments = Object.keys(card.comments).length

    let alreadyLiked = 'True';
    let heartFill = 'fas';
    let likeId = `data-like-id = "${card.current_user_like_id}"`;

    if (card.current_user_like_id === undefined) {
        alreadyLiked = 'False';
        heartFill = 'far';
        likeId = "";
    } 

    let alreadyBookmarked = 'True';
    let bookmarkFill = 'fas';
    let bookmarkId = `data-bookmark-id = "${card.current_user_bookmark_id}"`;
    if (card.current_user_bookmark_id === undefined) {
        alreadyBookmarked = 'False';
        bookmarkFill = 'far';
        bookmarkId = "";
    } 

    html = `
        <section class="card">
            <h2 class="header">${card.user.username}</h2>
            <img src="${card.image_url}" alt="">
            <div class="buttons">
                <div class="left">
                    <button class="bt-like" 
                            aria-label="Like"
                            aria-checked="${alreadyLiked}"
                            data-post-id=${card.id}
                            data-num-likes=${Object.keys(card.likes).length}
                            onclick=toggleLike(event)
                            ${likeId}>
                        <i class="${heartFill} fa-heart fa-lg"></i>
                    </button>
                    <button class="bt-comment">
                        <i class="far fa-comment fa-lg"></i>
                    </button>
                    <button class="bt-message">
                        <i class="far fa-paper-plane fa-lg"></i>
                    </button>
                </div>
                <button class="bt-bookmark" 
                        aria-label="Bookmark" 
                        aria-checked="${alreadyBookmarked}"
                        data-post-id=${card.id}
                        onclick=toggleBookmark(event)
                        ${bookmarkId}
                        class="right"
                        >
                    <i class="${bookmarkFill} fa-bookmark fa-lg" ></i>
                </button>
            </div> 
            <div class="likes">${Object.keys(card.likes).length} likes</div>    
            <div class="caption">
                <p><b>${card.user.username}</b> ${card.caption}</p>
            </div>` 
    switch(numComments) {
        case 0:
            break;
        case 1: 
            html += `<div class="comments">
                        <p><b>${card.comments[0].user.username}</b> ${card.comments[0].text}</p>
                     </div> `
            break;
        default:
            html += `<button class="link">View all ${Object.keys(card.comments).length} comments</button>
                    <div class="comments">  
                        <p><b>${card.comments[0].user.username}</b> ${card.comments[0].text}</p>
                    </div>`
            break;
    }
    html += `
                <p class="timestamp">${card.display_time}</p>
                <div class="add-comment">
                    <label for="${card.id}-label" style="display: none;">Add a comment</label>
                    <input type="text" placeholder="Add a comment..." id="${card.id}-label">
                    <button class="link" class="submit-comment">Post</button>
                </div>
            </section>`
    return html;
};

const displayCards =() => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            const html = posts.map(card2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

const toggleLike = ev => {
    const elem = ev.currentTarget;

    if (elem.getAttribute('aria-checked') === 'False') {
        like(elem.dataset.postId, elem);
    }
    else {
        unlike(elem.dataset.likeId,elem);
    }
}

const toggleBookmark = ev => {
    const elem = ev.currentTarget;

    if (elem.getAttribute('aria-checked') === 'False') {
        addBookmark(elem.dataset.postId, elem);
    }
    else {
        removeBookmark(elem.dataset.bookmarkId,elem);
    } 
}

const addBookmark = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    
    fetch("http://127.0.0.1:5000/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.children[0].classList.remove("far"); 
            elem.children[0].classList.add("fas");
            elem.setAttribute('aria-checked', 'True');
            elem.setAttribute('data-bookmark-id', data.id);
        });
}

const removeBookmark = (bookmarkId, elem) => {
    fetch(`http://127.0.0.1:5000/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.children[0].classList.remove("fas"); 
        elem.children[0].classList.add("far");
        elem.setAttribute('aria-checked', 'False');
        elem.removeAttribute('data-bookmark-id', data.id);
    });
}

const like = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    
    fetch("http://127.0.0.1:5000/api/posts/likes/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.children[0].classList.remove("far"); 
            elem.children[0].classList.add("fas");
            elem.setAttribute('aria-checked', 'True');
            elem.setAttribute('data-like-id', data.id);
            console.log(data.numLikes);
            //  elem.parentElement.parentElement.parentElement.children[3].innerHTML;
        });
}

const unlike = (likeId, elem) => {
    fetch(`http://127.0.0.1:5000/api/posts/likes/${likeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.children[0].classList.remove("fas"); 
        elem.children[0].classList.add("far");
        elem.setAttribute('aria-checked', 'False');
        elem.removeAttribute('data-like-id', data.id);

    });
}

async function initPage() {
    displayStories();
    displayUserProfile();
    displaySuggestions();
    displayCards();
};

// invoke init page to display stories:
initPage();

