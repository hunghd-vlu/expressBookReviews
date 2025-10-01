const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if (username) {
        for (let user of users) {
            if (user.username === username) return false;
        }
        return true;
    } else { 
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(user => 
      user.username === username && user.password === password
  );
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let { username, password } = req.body;
  console.log("U: " + username + " P: " + password)
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: username
      }, "PrivateKeyMustBeKeptSecret", { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send(`Customer successfully logged in`);
  }
  else {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];
  
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ 
        message: `Book with ISBN ${isbn} not found`
    });
  }

  if (!review) {
      return res.status(400).json({ 
          message: "Review content is required" 
      });
  }

  if (!book.reviews) {
      book.reviews = {}; 
  }
  
  book.reviews[username] = review; 
  
  return res.status(200).json({
    message: `Your review for ISBN ${isbn} book has been successfully added/updated`,
    review: book.reviews[username]
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    
    let book = books[isbn];

    if (!book) {
        return res.status(404).json({ 
            message: `Book with ISBN ${isbn} not found` 
        });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ 
            message: `No reviews found for user ${username} for book ISBN ${isbn}` 
        });
    }

    delete book.reviews[username]; 
    return res.status(204).send(); 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
