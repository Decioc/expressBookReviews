const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usersamename = users.filter((user)=>{
    return user.username === username
  });
  if(usersamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username	
  let book = books[isbn]
  if (book) {
      let review = req.body.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          book['reviews'][reviewer] = review;
          books[isbn] = book;
      }
      res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  }  else {
      res.send("ISBN not found");
  }
});

// delete book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
   //*Write your code here

    const isbn = req.params.isbn
    const username = req.session.authorization.username
    if (books[isbn]) {
        let book = await books[isbn]
        delete book.reviews[username]
        return res.status(200).send("Review successfully deleted")
    } else {
        return res.status(404).json({message: "ISBN not found"})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
