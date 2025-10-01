const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let { username, password } = req.body

  const userIsValid = isValid(username)

  if (!username || !password) {
        return res.status(400).json({ 
            message: "Username and password are required to register" 
        });
  }
  if (!userIsValid) {
    return res.status(409).json({ 
          message: "Username already exists. Please choose another username" 
    });
  }

  users.push( {
      username,
      password
  })
  return res.status(201).json({message: `Customer successfully registred.`});

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
  if (book){
    return res.status(200).json({ 
            message: `Book details with ISBN ${isbn}`,
            book: book
    })
  } else {
    return res.status(404).json({ 
            message: `Book with ISBN ${isbn} not found. Please check the ISBN code again.` 
    });
  }
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
