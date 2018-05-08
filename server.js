
var cheerio = require("cheerio");

var request = require("request");

var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars")
var mongoose = require("mongoose");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var PORT = process.env.PORT || 3000;
var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Articles_DB";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("assets"));




console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from reddit's webdev board:" +
            "\n***********************************\n");




app.get('/', function(req, res){
    request("https://www.c-span.org", function(error, response, html) {


        var $ = cheerio.load(html);

        var results = [];


        $("div.text > a").each(function(i, element) {

            
            var title = $(element).text();
            // var link = $(element).children().attr("href");
            var link = $(element).attr("href");

            if(title.indexOf("View") < 0){
                results.push({
                    title: title,
                    link: link
                });   
            }
            
            // console.log(title, link);
        });
        var data = {results: results};
        res.render('index', data);
        // console.log(results);
    });
})

//we need to create post route to send users saved articles
//we also need to create our mongodb database and set up out mongoose config
app.post('/api/save-article', function(req, res ){
    db.savedArticles.create(req.body)
    .then(function(savedArticle){
        console.log(savedArticle); 
        res.json(savedArticle); 
    
    }  ) 
    .catch(function(err) {
        console.log(err); 
        res.json(err); 
    } )
} )

app.get('/saved_articles', function(req, res) {
    db.savedArticles.find()
    .then(function(savedArticles){
        console.log(savedArticles); 
        var data = {saved_articles: savedArticles}
        res.render('savedArticles', data); 
    } )
} )

app.listen(PORT, function(){
    console.log('Listening on ', PORT);
})