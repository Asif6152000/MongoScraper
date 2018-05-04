
var cheerio = require("cheerio");

var request = require("request");

var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars")
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var PORT = 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



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
        var data = {results};
        res.render('index', data);
        // console.log(results);
    });
})

//we need to create post route to send users saved articles
//we also need to create our mongodb database and set up out mongoose config
app.post('/save-articles')

app.listen(PORT, function(){
    console.log('Listening on ', PORT);
})