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

// // Task 1
// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.json(books)
// });

// Task 10
function getBooks() {
  return new Promise((resolve) => {
    resolve(books);
  });
}
public_users.get('/', async function (req, res) {
  try {
      const bookList = await getBooks();
      return res.status(200).json(bookList);
  } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({ message: "Server Error" });
  }
});

// // Task 2
// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   let book = books[isbn]
//   if (book){
//     return res.status(200).json({ 
//             message: `Book details with ISBN ${isbn}`,
//             book: book
//     })
//   } else {
//     return res.status(404).json({ 
//             message: `Book with ISBN ${isbn} not found. Please check the ISBN code again.` 
//     });
//   }
//  });

// Task 11
// Get book details based on ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve) => {
    const book = books[isbn];
    resolve(book);
  });
}
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = await getBookByISBN(isbn);
    
    if (book) {
      return res.status(200).json({ 
        message: `Book details with ISBN ${isbn}`,
        book: book
      });
    } else {
      return res.status(404).json({ 
        message: `Book with ISBN ${isbn} not found. Please check the ISBN code again.` 
      });
    }
  } catch (error) {
    console.error(`Error finding ISBN ${isbn}:`, error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// // Task 3
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let author = req.params.author
//   let result = {
//       "booksByAuthor": []
//   }
//   let keys = Object.keys(books)
//   for(let key of keys) {
//       let book = books[key]
//       if(book.author == author) {
//           result['booksByAuthor'].push(book)
//       }
//   }
//   return res.json(result)
// });

// Task 12
// Get book details based on author
async function getBooksByAuthor(author) {
    const foundBooks = [];
    
    for (const key in books) {
        const book = books[key];
        
        if (book.author === author) {
            foundBooks.push(book);
        }
    }
    return foundBooks;
}
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const booksByAuthorArray = await getBooksByAuthor(author);
        
        const result = {
            "booksByAuthor": booksByAuthorArray
        };

        return res.status(200).json(result); 

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Task 4
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

// Task 13
// Get all books based on title
async function getBooksByTitle(title) {
    const foundBooks = [];
    
    for (const key in books) {
        const book = books[key];
        
        if (book.title === title) { 
            foundBooks.push(book);
        }
    }
    return foundBooks;
}
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const booksByTitleArray = await getBooksByTitle(title);
        
        const result = {
            "booksByTitle": booksByTitleArray
        };

        return res.status(200).json(result); 

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let review = books[isbn].reviews
  return res.json(review)
});

module.exports.general = public_users;
