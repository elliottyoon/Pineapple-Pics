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
                          <p>${profile.username}</p>`;
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
    switch(numComments) {
        case 0:
            return `
            <section class="card">
                <p class="header">${card.user.username}</p>
                <img src="${card.image_url}" alt="">
                <div class="buttons">
                    <div class="left">
                        <i class="far fa-heart"></i>
                        <i class="far fa-comment"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <i class="far fa-bookmark" class="right"></i>
                </div> 
                <div class="likes">${Object.keys(card.likes).length} likes</div>    
                <div class="caption">${card.user.username} ${card.caption}</div>
                <p class="timestamp">${card.display_time}</p>
                <div class="add-comment">
                    <label for="${card.id}-label" style="display: none;">Add a comment</label>
                    <input type="text" placeholder="Add a comment..." id="${card.id}-label">
                    <button class="link" class="submit-comment">Post</button>

                </div>
            </section>`
        case 1:
            return `
            <section class="card">
                <p class="header">${card.user.username}</p>
                <img src="${card.image_url}" alt="">
                <div class="buttons">
                    <div class="left">
                        <i class="far fa-heart"></i>
                        <i class="far fa-comment"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <i class="far fa-bookmark" class="right"></i>
                </div> 
                <div class="likes">${Object.keys(card.likes).length} likes</div>    
                <div class="caption">
                    <p>${card.user.username} ${card.caption}</p>
                </div>
                <div class="comments">
                    <p>${card.comments[0].user.username} ${card.comments[0].text}</p>
                </div> 
                <p class="timestamp">${card.display_time}</p>
                <div class="add-comment">
                    <label for="${card.id}-label" style="display: none;">Add a comment</label>
                    <input type="text" placeholder="Add a comment..." id="${card.id}-label">
                    <button class="link" class="submit-comment">Post</button>

                </div>
            </section>` 
        default:
            return `
            <section class="card">
                <p class="header">${card.user.username}</p>
                <img src="${card.image_url}" alt="">
                <div class="buttons">
                    <div class="left">
                        <i class="far fa-heart"></i>
                        <i class="far fa-comment"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <i class="far fa-bookmark" class="right"></i>
                </div> 
                <div class="likes">${Object.keys(card.likes).length} likes</div>    
                <div class="caption">${card.user.username} ${card.caption}</div>
                <button class="link">View all ${Object.keys(card.comments).length} comments</button>
                <div class="comments">  
                    <p>${card.comments[0].user.username} ${card.comments[0].text}</p>
                </div>
                <p class="timestamp">${card.display_time}</p>
                <div class="add-comment">
                    <label for="${card.id}-label" style="display: none;">Add a comment</label>
                    <input type="text" placeholder="Add a comment..." id="${card.id}-label">
                    <button class="link" class="submit-comment">Post</button>
                </div>
            </section>`
    }
    
};

const displayCards =() => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            const html = posts.map(card2Html).join('\n');
            console.log(html);
            document.querySelector('#posts').innerHTML = html;
        })
};

// <div class="likes">47 likes</div>
// <div class="caption">
//     <p>ravendavis hello</p>
// </div>
// {% if post.get('comments')|length != 0%}
//     {% if post.get('comments')|length > 1 %}
//         <button class="view-more">View all {{post.get('comments')|length}} comments</button>
//     {% endif %}
//     <div class="comment">
//         <p class="comment-user">{{post.get('comments')[0].get('user').get('username')}}</p>
//         <div class="comment-text">
//             <p>{{post.get('comments')[0].get('text')}}</p>
//         </div>
//     </div>
// {% endif %}
// <p class="timestamp">{{post.get('display_time')}}</p>
// </div>
// <div class="card-interact">
// <div class="reaction">
//     <i class="far fa-smile"></i>
//     <label for="{{post.get('image_url')}}-label" style="display: none;">Add a comment</label>
//     <input type="text" placeholder="Add a comment..." id="{{post.get('image_url')}}-label">
// </div>
// <a href="">Post</a>
// </div>


const initPage = () => {
    displayStories();
    displayUserProfile();
    displaySuggestions();
    displayCards();
};

// invoke init page to display stories:
initPage();