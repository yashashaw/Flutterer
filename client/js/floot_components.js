/**
 * File: floot_components.js
 * -------------------------
 * Contains component construction functions that have to do with creating DOM
 * representations of floots, and groups of floots.
 */
"use strict";

/**
 * Component: NewsFeed
 * -------------------
 * Generates the elements needed to display the right side of the screen (the
 * "new floot" text box, and, below it, the list of floots that have been
 * posted).
 *
 * Returns the following structure:
 *   <div class="newsfeed">
 *       <NewFlootEntry />
 *       <FlootList />
 *   </div>
 *
 */
function NewsFeed(selectedUser, floots, actions) {
    let newsfeed = document.createElement("div");
    newsfeed.classList.add("newsfeed");

    newsfeed.appendChild(NewFlootEntry(selectedUser, actions));

    newsfeed.appendChild(FlootList(floots, selectedUser, actions));

    return newsfeed;
}


/**
 * Component: NewFlootEntry
 * ------------------------
 * Creates the interface for posting new floots (a textbox and a "Floot"
 * button). When the "Floot" button is clicked, a function in `actions` will be
 * called to send the new floot to the server.
 *
 * Returns a node with the following structure:
 *   <div class="new-floot-entry">
 *       <ProfilePicture />
 *       <textarea placeholder="What's fluttering?" />
 *       <button class="button floot-button">Floot</button>
 *   </div>
 */
function NewFlootEntry(selectedUser, actions) {
    let container = document.createElement("div");
    container.classList.add("new-floot-entry");

    let profilePic = ProfilePicture(selectedUser, "img/" + selectedUser + ".jpg");
    container.appendChild(profilePic);

    let textbox = document.createElement("textarea");
    textbox.setAttribute("placeholder", "What's fluttering?");
    container.appendChild(textbox);

    let flootButton = document.createElement("button");
    flootButton.classList.add("button");
    flootButton.classList.add("floot-button");
    flootButton.appendChild(document.createTextNode("Floot"));
    flootButton.addEventListener("click", postFloot);
    container.appendChild(flootButton);

    function postFloot() {
        actions.createFloot(textbox.value);
    }

    return container;
}

/**
 * Component: FlootList
 * --------------------
 * Creates a div that has a bunch of "cards" in it that display the floots in
 * the news feed.
 *
 * Returns a node with the following structure:
 *   <div class="floot-list">
 *       {{#for floot in floots}}
 *           <Floot />
 *       {{/for}}
 *   </div>
 */
function FlootList(floots, selectedUser, actions) {
    let container = document.createElement("div");
    container.classList.add("floot-list");
    for (let floot of floots) {
        let comp = Floot(floot, selectedUser,
            /* showDelete = */ floot.username === selectedUser, actions);

        container.appendChild(comp);
    }
    return container;
}

/**
 * Component: Floot
 * ----------------
 * Produces a "card" representing a floot on the screen. Each card shows the
 * poster's name, profile picture, and the contents of the floot. In addition,
 * there is a like count and comment count displayed in the bottom left, and,
 * if the currently logged-in user is the one that posted the floot, a "delete"
 * button in the top right.
 *
 * When the floot card is clicked, the provided openFlootInModal function will
 * be called (with the purpose of opening the floot in the modal to show its
 * comments). When the delete button is clicked, triggerDataRefresh will be
 * called (in order to refresh the news feed and ensure the Floot disappears
 * from the screen).
 *
 * Returns a node with the following structure:
 *   <div class="card floot-card">
 *       {{#if showDelete}}
 *           <DeleteButton />
 *       {{/if}}
 *       <ProfilePicture />
 *       <FlootContent />
 *       <LikeCommentCount />
 *   </div>
 */
function Floot(flootInfo, selectedUser, showDelete, actions) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("floot-card");

    if (showDelete) {
        card.appendChild(DeleteButton(deleteFloot));
    }
    card.appendChild(ProfilePicture(flootInfo.username, "img/" + flootInfo.username + ".jpg"));
    card.appendChild(FlootContent(flootInfo.username, flootInfo.message));
    card.appendChild(LikeCommentCount(flootInfo, selectedUser, toggleLike));
    card.addEventListener("click", handleCardClick);

    /**
     * Handle clicks on the Floot card. (Open the modal to display this floot's
     * comments.)
     */
    function handleCardClick() {
        actions.openFlootInModal(flootInfo);
    }

    /**
     * Handle clicks on the delete button.
     */
    function deleteFloot() {
        actions.deleteFloot(flootInfo);
    }

    /**
     * Handles clicks on the like button. If the floot is already liked,
     * un-like it; if it is not liked, like it.
     */
    function toggleLike(e) {
        // Stop modal from opening.
        e.stopPropagation();
    }

    return card;
}

/**
 * Component: FlootContent
 * -----------------------
 * Creates a simple div that contains the name of the poster and the message of
 * the floot. 
 * 
 * Returns a node with the following structure:
 *   <div>
 *       <div class="user">
 *           {{ name }}
 *       </div>
 *       <div>
 *           {{ message }}
 *       </div>
 *   </div>
 */
function FlootContent(name, message) {
    let container = document.createElement("div");

    let userContainer = document.createElement("div");
    userContainer.appendChild(document.createTextNode(name));
    userContainer.classList.add("user");

    let messageContainer = document.createElement("div");
    messageContainer.appendChild(document.createTextNode(message));

    container.appendChild(userContainer);
    container.appendChild(messageContainer);

    return container;
}

/**
 * Component: LikeCommentCount
 * ---------------------------
 * Creates a simple div, positioned in the bottom right of each post,
 * containing the comment count, like button, and like count.
 *
 * Returns a node with the following structure:
 *   <div class="comment-like-count">
 *       <LikeCount />
 *       <CommentCount />
 *   </div>
 */
function LikeCommentCount(flootInfo, selectedUser, onLike) {
    let container = document.createElement("div");
    container.classList.add("comment-like-count");
    let numComments = Object.keys(flootInfo.comments).length;
    container.appendChild(CommentCount(numComments));

    return container;
}