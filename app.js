/*
 * Name: Junguk Lee
 * Date: May 20, 2020
 * Section: CSE 154 AK
 *
 * This is the JS to receive the request and send back to the client from the
 * server side. It deals with login and post.
 */
"use strict";

const express = require("express");
const app = express();

const multer = require('multer');
const fs = require("fs").promises;

app.use(express.json()); // built-in middleware

app.use(multer().none());

app.post('/login', async (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  let register = req.body.register;

  if (name && password && register) {
    let login = await fs.readFile("info.json", "utf8");
    login = JSON.parse(login);
    let keys = Object.keys(login);
    if (!(keys.includes(name)) && register === "true") {
      login[name] = {
        "password": password,
        "posts": {
          "title": [],
          "post": []
        }
      };
    }
    await fs.writeFile("info.json", JSON.stringify(login));
    res.type('json').send(login);
  } else {
    res.type('text').status(400);
    res.send('You missed parameters');
  }
});

app.post('/posts/new', async (req, res) => {
  let title = req.body.title;
  let post = req.body.post;
  let name = req.body.name;

  let posts = await fs.readFile('info.json', 'utf8');
  posts = JSON.parse(posts);
  let postList = posts[name].posts;
  postList.title.push(title);
  postList.post.push(post);

  let newPosts = {
    "title": "",
    "post": ""
  };
  newPosts.title = title;
  newPosts.post = post;

  await fs.writeFile('info.json', JSON.stringify(posts));
  res.type('json').send(newPosts);
});

app.get('/posts', async function(req, res) {
  let name = req.query.name;
  let file = await fs.readFile('info.json', 'utf8');
  file = JSON.parse(file);
  let posts = file[name].posts;
  res.type('json').send(posts);
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);