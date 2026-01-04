/**
 * File: flutterer.js
 * ------------------
 * Contains the logic that makes Flutterer work, as well as all initialization.
 */
"use strict";

// Specify a list of valid users.
const USERS = [
    "Ben Yan",
    "Andy Wang",
    "Diego Padilla",
    "Eugene Francisco",
    "Jenny Wei",
    "Sabrina Yen-Ko",
    "Tina Zheng",
    "Doris Beyonce James-Cain",
    "Jerry Cain",
];

/**
 * Function: Flutterer
 * -------------------
 * Flutterer's entry point
 */
function Flutterer() {
    let info = null;
    let selectedUser = USERS[0];
    
    //rerenders or updates the page either keeping the modal if open or w/o modal
    function rerender(flootId) {
        while (document.body.lastChild != null) {
            document.body.removeChild(document.body.lastChild);
        }
        
        let selectedFloot = null; //default, if modal was not open before
        if (flootId !== null && info !== null) {
            for (let i = 0; i < info.length; i++) {
                if (info[i].id === flootId) {
                    selectedFloot = info[i]; //use the updated floot aggregate
                    break;
                }
            }
        }
        
        document.body.appendChild(MainComponent(selectedUser, info, actions, selectedFloot));
    }
  
    //takes info from successhandler and parses it into JSON
    function handleFlootsResponse(response, flootId) {
        let payload = response.getPayload();
        info = JSON.parse(payload);
        rerender(flootId);
    }
    
    //api get request
    function loadFloots(flootId) {
        let req = AsyncRequest("/api/floots");
        req.setSuccessHandler(function(response) {
            handleFlootsResponse(response, flootId);
        });
        req.send();
    }
    
    //api post request
    function postAndReload(url, payload, flootId) {
        let request = AsyncRequest(url);
        request.setMethod("POST");
        request.setPayload(JSON.stringify(payload));
        request.setSuccessHandler(function() {
            loadFloots(flootId);
        });
        request.send();
    }
    
    let actions = {
        changeSelectedUser: function(username) { //changes user
            selectedUser = username;
            rerender(null);
        },
        createFloot: function(message) { //creates floot
            postAndReload("/api/floots", {
                username: selectedUser,
                message: message
            }, null);
        },
        deleteFloot: function(flootInfo) { //deletes floot
            postAndReload("/api/floots/" + flootInfo.id + "/delete", {
                username: selectedUser
            }, null);
        },
        openFlootInModal: function(flootObject) { //opens modal
            rerender(flootObject.id);
        },
        closeModal: function() { //closes modal
            rerender(null);
        },
        createComment: function(floot, text) { //creates a comment
            postAndReload("/api/floots/" + floot.id + "/comments", {
                username: selectedUser,
                message: text
            }, floot.id);
        },
        deleteComment: function(flootId, id) { //deletes a comment
            postAndReload("/api/floots/" + flootId + "/comments/" + id + "/delete", {
                username: selectedUser
            }, flootId);
        }
    };
    
    //initial page
    loadFloots(null);
}

/**
 * Component: MainComponent
 * ------------------------
 * Constructs all the elements that make up the page.
 * 
 * Returns a node with the following structure:
 *   <div class="primary-container">
 *       <Sidebar />
 *       <NewsFeed />
 *   </div>
 */
function MainComponent(selectedUser, floots, actions, selectedFloot) {
    let main = document.createElement("div");
    main.classList.add("primary-container");
    main.appendChild(Sidebar(USERS, selectedUser, actions));
    main.appendChild(NewsFeed(selectedUser, floots, actions));
    if (selectedFloot !== null) {
        main.appendChild(FlootModal(selectedFloot, selectedUser, actions));
    }
    return main;
}

(() => {
    function log_info(msg, ...extraArgs) {
        console.info("%c" + msg, "color: #8621eb", ...extraArgs);
    }
    function log_success(msg, ...extraArgs) {
        console.info("%c" + msg, "color: #39b80b", ...extraArgs);
    }
    function log_error(msg, ...extraArgs) {
        console.warn("%c" + msg, "color: #c73518", ...extraArgs);
    }
    const _fetch = window.fetch;
    window.fetch = function(...args) {
        log_info(`Making async request to ${args[1].method} ${args[0]}...`);
        return new Promise((resolve, reject) => {
            _fetch(...args).then((result) => {
                const our_result = result.clone();
                our_result.text().then((out_text) => {
                    if (our_result.ok) {
                        log_success(`Server returned successful response for ${our_result.url}`);
                    } else {
                        log_error(`Server returned Error ${our_result.status} `
                            + `(${our_result.statusText}) for ${our_result.url}`,
                            out_text);
                    }
                    resolve(result);
                });
            }, (error) => {
                log_error('Error!', error);
                reject(error);
            });
        });
    };
})();

document.addEventListener("DOMContentLoaded", Flutterer);