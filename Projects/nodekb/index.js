const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Bring in Models
let Article = require('./models/article');

mongoose.connect('mongodb+srv://KalviMongo:KalviMongo@cluster0.odivl.mongodb.net/nodekb?retryWrites=true&w=majority');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// Init Index
const index = express();

//load view engine
index.set('views', path.join(__dirname, 'views'));
index.set('view engine', 'pug'); 

// parse application/x-www-form-urlencoded
index.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
index.use(bodyParser.json())

// Set public folder
index.use(express.static(path.join(__dirname, 'public')));

//Home route
index.get('/', function(req, res) {
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        } 
        else {
            res.render ('index', {
                title:'Articles',
                articles: articles

    });
}
});
});

//Add Route Article
index.get ('/articles/add', function(req, res) {
    res.render ('add_article', {
        title:'Add Article'
    });
});

//Add Submit POST Route 
index.post ('/articles/add', function(req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save( function (err) {
        if (err) {
            console.log(err);            
        } else {
            res.redirect('/');
        }

    });
    //console.log(req.body.title);
});

//Add Route google login
index.get ('/login', function(req, res) {
    res.render ('login', {});
});

//start server
index.listen(3000, function() {

    console.log('server started on port 3000...')
})
console.log('Hello world');