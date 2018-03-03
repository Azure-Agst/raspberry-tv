// (c) 2018 Andrew Augustine
// this'll be the final index file.

// ========[Notes]========
// - Use Express/Handlebars to render dynamic upload page
// - Use json and a background js function to dynamically update div


// ========[Meta and shit]========

// let's explain each of these..
var express = require('express'); //Server Engine. Use this for templating engine
var exphbs  = require('express-handlebars'); //Templating. Similar to jekyll.
var formidable = require('formidable'); //for form handling
var fs = require('fs'); //to mess with filesystem
var path = require('path'); //to find where we're located

var app = express(); // init express

app.set('view engine', 'handlebars'); //set handlebars as render engine
app.use('/images', express.static(path.join(__dirname, 'images'))); // set ./images as static folder
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // set ./assets as static folder
app.engine('handlebars', exphbs({defaultLayout: 'main'})); //set main.handlebars as our master layout

// ========[Functions]========

//NOTE: ayyyyyy it's callback now!
function getImages(callback) {
  var images;
  fs.readdir('./images/', function(err, files){
    images = files.filter(word => word.endsWith(".jpeg")||word.endsWith(".jpg")||word.endsWith(".png"));
    //console.log(im)
    if(typeof callback == "function") callback(images);
  });
};


// ========[Webserver]========

app.all('/', function (req, res) {
	
	var images = getImages();
	
	if (req.method == 'POST') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			// vvvvv [Debug, debug, debug!] vvvvv
			//console.log(fields);console.log(files);
			
			//determine what form
			if (fields.upload == 'true') { // it's an upload
				if (files.filetoupload.name == '') {
					res.locals.alert = "<div class='alert alert-warning' role='alert'>You can't upload nothing!</div>"
					postprocessing();
					return;
				}
				var oldpath = files.filetoupload.path; var filename;
				if (fields.rename == undefined) {filename == files.filetoupload.name;} else {filename = fields.rename};
				if (filename.endsWith(".jpg") == false || filename.endsWith(".jpeg") == false || filename.endsWith(".png") == false) filename += "."+files.filetoupload.name.split('.').pop();
				var newpath = __dirname + "/images/" + filename;
				fs.rename(oldpath, newpath, function (err) {
					if (err) throw err;
					res.locals.alert = "<div class='alert alert-success' role='alert'>File "+filename+" was uploaded!</div>"
					postprocessing();
					return;
				});
			} else if (fields.filedelete !== null) { //is delete form
				fs.unlink('./images/'+fields.filedelete, function(err){
					if (err) throw err;
					res.locals.alert = "<div class='alert alert-danger' role='alert'>File "+fields.filedelete+" was deleted!</div>"
					postprocessing();
					return;
				});
			} else { //what.
				res.write("what.");
				return res.end();
			}
		});
	} else {
		setTimeout(function(){
			postprocessing();
		}, 500);
	}

	function postprocessing(){
		/* fs.readdir('./images/', function(err, files){
			var images = files.filter(word => word.endsWith(".jpeg")||word.endsWith(".jpg")||word.endsWith(".png")) */
		getImages(function(images){
			var imagelist = "";
			for (i=0; i<images.length; i++) {
				imagelist += "<div class='row'><div class='column1'><p>"+images[i]+"</p></div><div class='column2'><img src ='./images/"+images[i]+"' style='float: right;' height='100px'></div><div class='column3'><form method='post' enctype='multipart/form-data'><button class='btn btn-danger' name='filedelete' value='"+images[i]+"' style='float: right;'>X</button></form></div></div>";
			}
			return res.render('home', {images: imagelist, alert: res.locals.alert});
		});
		/* }) */
	};
});

app.get('/present', function (req, res) {
	// Page 2 should be entirely local, therefore no preprocessing needed. Just render and go!
    return res.render('page2');
});


// ========[E R R O R B O Y Z]========

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


// ========[Start!]========
app.listen(8080, () => console.log("yo here we at"));
