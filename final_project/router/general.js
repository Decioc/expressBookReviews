const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let usersamename = users.filter((user)=>{
      return user.username === username
    });
    if(usersamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User " +username+ " successfully registred. Now you can login"});
    } else {
        return res.status(404).json({message: "User" +username+ " already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

//=====================================================================
//
//  Syncronous
//
//=====================================================================   
//public_users.get('/',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
//    res.send(JSON.stringify({books},null,4));
//  });
//=====================================================================
//
//  Asyncronous using promisses
//
//===================================================================== 
// Task 10 
function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 3000);
  
      return;
    });
  }
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //Sample using promisse
  const promisseBooks = getAllBooks();
  promisseBooks.then((listBooks) => {
    res.send(JSON.stringify(listBooks));
  });
});

//=====================================================================
//
//  Syncronous
//
//===================================================================== 
// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
//  let isbn = req.params.isbn;
//  let book = books[isbn];
//  if (book) {
//    res.send(JSON.stringify(book));  
//  } else {
//    res.send("No books found");
//  }
//});
//=====================================================================
//
//  Asyncronous using promisses
//
//===================================================================== 
// Task 11
  
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 3000);
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getBookByISBN(isbn)
      .then(response => {
        res.send(JSON.stringify(response));
       })
       .catch(error => {
        res.send(error);
       });
    });                
//=====================================================================
//
//  Syncronous
//
//=====================================================================  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //Write your code here
//  let author = req.params.author;
//  if (author) {
//    result = [];
//    Object.keys(books).forEach(key => {
//        if (books[key].author == author) {
//          result.push({
//            id: key,
//            author: books[key].author,
//            title: books[key].title,
//            reviews: books[key].reviews
//          });
//        }
//    });
//    res.send(JSON.stringify(result));
//  } else {
//     return res.status(404).json({message: "No books found!"});
//  }    
//});
//=====================================================================
//
//  Asyncronous using promisses
//
//=====================================================================  

  // Task 12
  function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 3000);
    });
  }

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let author = req.params.author;
    getBookByAuthor(author)
      .then(response => {
        res.send(JSON.stringify(response));
       })
       .catch(error => {
        res.send(error);
       });
});         
//=====================================================================
//
//  Syncronous
//
//=====================================================================  
// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
  //Write your code here
//  let title = req.params.title;
//  if (title) {
//    result = [];
//    Object.keys(books).forEach(key => {
//        if (books[key].title == title) {
//          result.push({
//            id: key,
//            author: books[key].author,
//            title: books[key].title,
//            reviews: books[key].reviews
//          });
//        }
//    });
//    res.send(JSON.stringify(result));
//  } else {
//      return res.status(404).json({message: "No books found!"});
//  }  
//});
//=====================================================================
//
//  Asyncronous using promisses
//
//=====================================================================  
// Task 13
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const key in books) {
          if (books[key].title === title) {
            resolve(books[key]);
          }
        }
        reject("Book not found");
      }, 3000);
    });
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let title = req.params.title;
    getBookByTitle(title)
      .then(response => {
        res.send(JSON.stringify(response));
       })
       .catch(error => {
        res.send(error);
       });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if (ISBN) {
    res.send(JSON.stringify(books[ISBN].reviews));
  } else {
      return res.status(404).json({message: "No books found!"});
  }

});

module.exports.general = public_users;
