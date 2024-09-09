const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Register a new user
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required" })
  }

  // Check if the user already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({message: "Username already exists" });
  }

  // Add new user
  users.push( {username, password });

  return res.status(200).json( {message: "User successfully registered. User can now login"} );
});



// Get the book list available in the shop
public_users.get('/',(req, res) =>{
  // Write your code here
  res.send(JSON.stringify(books,null,4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(400).json({message: "Book not found!"});
  }
 });
  


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Obtain keys of the Object books using the Object.keys method
  const bookKeys = Object.keys(books);

  // Filter books that match the author
  const bookByAuthor = bookKeys.filter(key => books[key].author.toLowerCase() === author.toLowerCase())
  .map(key => books[key]);
  
  if (bookByAuthor.length > 0) {
    return res.status(200).json(bookByAuthor);
  } else {
    return res.status(400).json({message: "Book not found"});
  }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Assign given title to constant variable title
  const title = req.params.title;

  // Get the keys of the books in the Object of books
  const bookKeys = Object.keys(books);

  // Filter out the book using the key value of book title
  const bookByTitle = bookKeys.filter(key => books[key].title.toLowerCase() === title.toLowerCase())
  .map(key => books[key]);

  // Check if book exist
  if (bookByTitle.length > 0) {
    return res.status(200).json(bookByTitle);
  } else {
    return res.status(400).json({message: "Book not found with title " + title});
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Get book review using ISBN
  const isbn = req.params.isbn;

  // Check if book exists
  if (books[isbn]) {

    // Retrieve book reviews
    const reviews = books[isbn].reviews;

    return res.status(200).json(reviews);
  } else {
    return res.status(400).json({message: `No book found with ISBN ${isbn}` });
  }
});

module.exports.general = public_users;
