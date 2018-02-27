// (c) 2018 Andrew Augustine
// this'll be the final index file.

// ========[Notes]========
// - Use Express/Handlebars to render dynamic upload page
// - Use a switch statement to handle the selection of pages
// - No actual html! That's a first.

var express = require('express');
var exphbs  = require('express-handlebars');
var formidable = require('formidable');
var fs = require('fs');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(8080, () => console.log("yo here we at"));