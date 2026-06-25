const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){

        return res.status(404).json({
            message:"Username or password missing"
        });

    }


    if(isValid(username)){

        return res.status(404).json({
            message:"User already exists"
        });

    }


    users.push({
        username:username,
        password:password
    });


    return res.status(200).json({
        message:"User successfully registered"
    });

});

// Get the book list available in the shop
function getBooks() {
    return new Promise((resolve) => {
        resolve(books);
    });
}

public_users.get('/', async (req, res) => {
    const data = await getBooks();
    return res.send(JSON.stringify(data, null, 4));
});

// Get book details based on ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve) => {
        resolve(books[isbn]);
    });
}

public_users.get('/isbn/:isbn', async (req, res) => {
    const book = await getBookByISBN(req.params.isbn);
    return res.json(book);
});

// Get book details based on author
function getBooksByAuthor(author) {
    return new Promise((resolve) => {

        let filteredBooks = {};

        Object.keys(books).forEach(key => {
            if (books[key].author === author) {
                filteredBooks[key] = books[key];
            }
        });

        resolve(filteredBooks);
    });
}

public_users.get('/author/:author', async (req, res) => {
    const result = await getBooksByAuthor(req.params.author);
    return res.json(result);
});

// Get all books based on title
function getBooksByTitle(title) {
    return new Promise((resolve) => {

        let filteredBooks = {};

        Object.keys(books).forEach(key => {
            if (books[key].title === title) {
                filteredBooks[key] = books[key];
            }
        });

        resolve(filteredBooks);
    });
}

public_users.get('/title/:title', async (req, res) => {
    const result = await getBooksByTitle(req.params.title);
    return res.json(result);
});

//  Get book review
public_users.get('/review/:isbn', function(req,res){

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn].reviews
    );

});

module.exports.general = public_users;
