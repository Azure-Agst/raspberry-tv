// (c) 2018 Andrew Augustine
// this'll be the final index file.

// ========[Notes]========
// - Use Express/Handlebars to render dynamic upload page
// - Use a switch statement to handle the selection of pages
// - No actual html! That's a first.

// let's explain each of these..
var express = require('express'); //Server Engine. Use this for templating engine
var exphbs  = require('express-handlebars'); //Templating. Similar to jekyll.
var formidable = require('formidable'); //for form handling
var fs = require('fs'); //to mess with filesystem
var path = require('path');

var app = express();

app.set('view engine', 'handlebars');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// Consider using a switch statement here

app.all('/', function (req, res) {
	if (req.method == 'POST') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			//console.log(fields);console.log(files);
			
			//determine what form
			if (files.filetoupload !== undefined) { // it's an upload
				var oldpath = files.filetoupload.path; var filename;
				if (fields.rename == undefined) {filename == files.filetoupload.name;} else {filename = fields.rename};
				if (filename.endsWith(".jpg") == false || filename.endsWith(".jpeg") == false || filename.endsWith(".png") == false) filename += "."+files.filetoupload.name.split('.').pop();
				var newpath = __dirname + "/images/" + filename;
				fs.rename(oldpath, newpath, function (err) {
					if (err) throw err;
					postprocessing();
					return;
				});
			} else if (fields.filedelete !== null) {
				fs.unlink('./images/'+fields.filedelete, function(err){
					if (err) throw err;
					postprocessing();
					return;
				});
			} else {
				res.write("what.");
				return res.end();
			}
		});
	} else {
		postprocessing();
	}

	function postprocessing(){
		fs.readdir('./images/', function(err, files){
			var images = files.filter(word => word.endsWith(".jpeg")||word.endsWith(".jpg")||word.endsWith(".png"))
			var imagelist = "";
			for (i=0; i<images.length; i++) {
				imagelist += "<div class='row'><div class='column1'><p>"+images[i]+"</p></div><div class='column2'><img src ='./images/"+images[i]+"' style='float: right;' height='100px'></div><div class='column3'><form method='post' enctype='multipart/form-data'><button class='btn btn-danger' name='filedelete' value='"+images[i]+"' style='float: right;'>X</button></form></div></div>";
			}
			return res.render('home', {images: imagelist});
		})
	};
});

app.get('/index', function (req, res) {
    return res.render('home');
});

app.get('/present', function (req, res) {
    return res.render('page2');
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
