// (c) 2018 Andrew Augustine
// this'll be the final index file.

// ========[Notes]========
// - Use Express/Handlebars to render dynamic upload page
// - Use a switch statement to handle the selection of pages
// - No actual html! That's a first.

// let's explain each of these..
var express = require('express'); //Server Engine. Use this for templating engine, heet 
var exphbs  = require('express-handlebars');
var formidable = require('formidable');
var fs = require('fs');

var app = express();

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// Consider using a switch statement here

app.get('/', function (req, res) {
	fs.readdir('./images/', function(err, files){
		var images = files.filter(word => word.endsWith(".jpeg")||word.endsWith(".jpg")||word.endsWith(".png"))
		//console.log(images)
		var imagelist = "";
		for (i=0; i<images.length; i++) {
			imagelist += "<p>"+images[i]+"</p>";
		}
		res.render('home', {images: imagelist});
	})
});

app.get('/index', function (req, res) {
    res.render('home');
});

app.get('/present', function (req, res) {
    res.render('page2');
});

// E R R O R B O Y Z
// (500 errors may be wonky, but at least 404 works.)
app.use(function (req, res, next) {
  res.status(404).send("<h2><u>Error: 404 (File not found)</u></h2>"
                      +"<p>The resource you tried loading does not exist. Make sure the link is typed correctly, or contact a server administrator for help.</p>"
                      +"<pre>Raspi-TV/1.0.0</pre>")

  res.status(500).send("<h2><u>Error: 500 (Processing Error)</u></h2>"
                      +"<p>The server was unable to process your request. Contact a server administrator for help.</p>"
                      +"<pre>Raspi-TV/1.0.0</pre>")

  res.status(502).send("<h2><u>Error: 502 (Bad Gateway)</u></h2>"
                      +"<p>Bad gateway. Refresh the page, or contact a server administrator for help.</p>"
                      +"<pre>Raspi-TV/1.0.0</pre>")
})

app.listen(8080, () => console.log("yo here we at"));
