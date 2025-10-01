const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password

  if(username && password && isValid(username)) {
    users.push( {
        username,
        password
    })
    return res.json({message: `Customer successfully registred.`});
  } else {
    console.log("Name: " + username)
    console.log("Pass: " + password)
    return res.send(`Unable to register, username is invalid / exists. Choose a different username.`)
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn]
  return res.json(book)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let result = {
      "booksByAuthor": []
  }
  let keys = Object.keys(books)
  for(let key of keys) {
      let book = books[key]
      if(book.author == author) {
          result['booksByAuthor'].push(book)
      }
  }
  return res.json(result)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let result = {
    "booksByTitle": []
  }
  let keys = Object.keys(books)
  for(let key of keys) {
      let book = books[key]
      if(book.title == title) {
          result['booksByTitle'].push(book)
      }
  }
  return res.json(result)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let review = books[isbn].reviews
  return res.json(review)
});

module.exports.general = public_users;
