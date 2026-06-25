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

// Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});

// Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

});

// Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

});


// Get all books based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Title not found"
        });
    }

});

//  Get book review
public_users.get('/review/:isbn', function(req,res){

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn].reviews
    );

});

module.exports.general = public_users;
