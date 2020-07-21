/*
 * Name: Junguk Lee
 * Date: May 20, 2020
 * Section: CSE 154 AK
 *
 * This is the JS to implement the UI for loggin-in and posint website, and
 * post the new post to the board.
 */
'use strict';

let register = false;
const URL = "/";

(function() {

  window.addEventListener("load", init);

  /**
   * This function calls a function when the buttons are clicked.
   */
  function init() {
    id("login-btn").addEventListener("click", function() {
      register = false;
      checkRequirement();
    });
    id("signup-btn").addEventListener("click", clickRegister);
  }

  /**
   * when the register button is clicked, the login button must be hidden and the
   * input that is not empty must be cleaned. Then when we click the register button
   * again, it will call the function which process registration.
   */
  function clickRegister() {
    let loginButton = id("login-btn");
    let registerButton = id("register-btn");
    let signupButton = id("signup-btn");
    let cancel = id("cancel-btn");
    let header = qs(".heading");

    cleanInput();

    header.textContent = "You are doing registration";
    cancel.classList.remove("hidden");
    registerButton.classList.remove("hidden");
    loginButton.classList.add("hidden");
    signupButton.classList.add("hidden");
    registerButton.addEventListener("click", function() {
      register = true;
      checkRequirement();
    });
    cancel.addEventListener("click", cancelButton);
  }

  /**
   * display requirement message if we did not fill any of name or password and
   * call register or login function depends on the parameter
   */
  function checkRequirement() {
    let name = id("name");
    let password = id("password");
    if (name.value !== "" && password.value !== "") {
      id("requirement").classList.add("hidden");
      if (register === true) {
        registerFetching();
      } else {
        loginFetching();
      }
    } else {
      id("requirement").classList.remove("hidden");
    }
  }

  /**
   * if the button is clicked, we go back to the previous menu and make the cancel
   * button vanish
   */
  function cancelButton() {
    let loginButton = id("login-btn");
    let cancel = id("cancel-btn");
    let header = qs(".heading");

    header.textContent = "Log in to enter this page";
    loginButton.classList.remove("hidden");
    cancel.classList.add("hidden");

    cleanInput();
  }

  /**
   * clean all value of inputs if it is not empty
   */
  function cleanInput() {
    let name = id("name");
    let password = id("password");

    if (name.value !== "" || password !== "") {
      if (name.value !== "") {
        name.value = "";
      }
      if (password.value !== "") {
        password.value = "";
      }
    }
  }

  /**
   * Request the data from login server by fetching and process login
   */
  function registerFetching() {
    let body = new FormData();
    body.append("name", id("name").value);
    body.append("password", id("password").value);
    body.append("register", true);

    fetch(URL + "login", {method: "POST", body: body})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(getRegister)
      .catch(errLoginHandler);
  }

  /**
   *  check whetehr name is already existed or not from the login server
   *  and add new log-in information if it does not exist in the previous
   *  log-in lists.
   * @param {JSON} response - data which stores all registration information
   * received from the server
   */
  function getRegister(response) {
    let name = id("name").value;
    let password = id("password").value;
    let loginBtn = id("login-btn");
    let registerBtn = id("register-btn");
    let cancelBtn = id("cancel-btn");
    let passwordJson = response[name].password; // password obtained from the requested data

    if (passwordJson === password) {
      let header = qs(".heading");

      header.textContent = "Successfully registered";
      loginBtn.classList.remove("hidden");
      registerBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
    } else {
      id("register-check").classList.remove("hidden");
    }
  }

  /**
   * Request the data from login server by fetching and process login
   */
  function loginFetching() {
    let body = new FormData();
    body.append("name", id("name").value);
    body.append("password", id("password").value);
    body.append("register", false);

    fetch(URL + "login", {method: "POST", body: body})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(getLogin)
      .catch(errLoginHandler);
  }

  /**
   *  shift screen if we succesffuly log-in but if we failed to log-in, then show
   * the message
   * @param {JSON} response - log-in data received from the server
   */
  function getLogin(response) {
    let name = id("name").value;
    let password = id("password").value;
    if (name in response) {
      if (response[name].password === password) {
        toggleview();
        getPosts();
        id("log-out").addEventListener("click", function() {
          window.location.reload();
        });
      } else {
        id("password-not-match").classList.remove("hidden");
      }
    } else {
      id("login-check").classList.remove("hidden");
    }
  }

  /**
   * make the log-in board to be hidden and display post board
   */
  function toggleview() {
    id("main-board").classList.toggle("hidden");
    id("posts-board").classList.toggle("hidden");
  }

  /**
   * This function displays the message that the data after fetching to the
   * post server. Then, if the posts button is clicked, then we add the new post
   * to the post-board.
   */
  function getPosts() {
    let header = qs("h1");
    header.textContent = "Login successful!";
    let name = id("name").value;
    let url = URL + 'posts?name=' + name;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(prevPosts)
      .catch(errPostHandler);

    id("posts").addEventListener("submit", postFetching);
  }

  /**
   * display all the posts that the following account has previously posted by
   * receiving the data from /post server
   * @param {JSON} res - data contains all the title and posts of the following account
   */
  function prevPosts(res) {
    for (let i = 0; i < res.title.length; i++) {
      let title = res.title[i];
      let post = res.post[i];

      generatePost(title, post);
    }
  }

  /**
   * sent the input value of title and post to the server then call the
   * function which add new posts to the post lists
   * @param {object} e - object refers to the object that is clicked
   */
  function postFetching(e) {
    e.preventDefault();
    let name = id("name").value;
    let body = new FormData(e.currentTarget);
    body.append("name", name);

    fetch(URL + "posts/new", {method: "POST", body: body})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(newPosts)
      .catch(errPostHandler);
  }

  /**
   * Get the json data from the /post server and add on the DOM
   * @param {JSON} response - data of posts that received from the /post server
   */
  function newPosts(response) {
    let resTitle = response.title;
    let resPost = response.post;

    generatePost(resTitle, resPost);
  }

  /**
   * this function generate article and append title and post to the article.
   * Then, add into the DOM
   * @param {string} strTitle -refers to the content of title
   * @param {string} strPost -refers to the content of post
   */
  function generatePost(strTitle, strPost) {
    let div = gen("div");
    let article = gen("article");
    let title = gen("h2");
    let post = gen("p");

    title.textContent = strTitle;
    post.textContent = strPost;

    div.classList.add("post-div");
    id("post-results").appendChild(div);
    div.appendChild(article);
    article.appendChild(title);
    article.appendChild(post);
  }

  /**
   * Display the error message, when we catch failures on the fetching of login
   * server
   * @param {Error} err - the error thrown when we catch failures
   */
  function errLoginHandler(err) {
    let error = gen("p");
    error.id = "error";
    error.textContent = err;
    id("main-board").appendChild(error);
  }

  /**
   * Display the error message, when we catch failures on the fetching of the post
   * server
   * @param {Error} err - the error thrown when we catch failures
   */
  function errPostHandler(err) {
    let error = gen("p");
    error.id = "error";
    error.textContent = err;
    id("posts-board").appendChild(error);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tagname.
   * @param {string} tagName - name of element to create and return.
   * @returns {object} new DOM element with the given tagname.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();