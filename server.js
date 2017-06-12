let bodyParser = require('body-parser');
let express = require('express');
let session = require('express-session');

let app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//-------------------------------------------
//Configure Session
//-------------------------------------------
let hour = 3600000; //one hour in millisecond 
app.use(session({
	name: "cookieSessionId",
	secret: 'secretKey',
	saveUninitialized: false,
	resave: true,
	cookie: {
		expires: new Date(Date.now() + hour)
	}
}));

console.log("Session expires in: " + new Date(Date.now() + hour));
//-------------------------------------------

app.get('/', function (req, res) {
	if (req.session.email) {
		res.redirect('/admin');
	} else {
		res.render('index.html');
	}
});

app.post('/login', function (req, res) {
	req.session.email = req.body.email;
	res.end('success');
});

app.get('/admin', function (req, res) {
	if (req.session.email) {
		res.write('<h1>E-mail: ' + req.session.email + '</h1><br>');
		res.write('<spam><b>Cookie expires in</b> - ' + req.session.cookie._expires + '</spam><br><br>');
		res.write('<spam><b>Object req.session</b> - ' + JSON.stringify(req.session) + '</spam><br><br>');
		res.end('<a href=' + '/logout' + '>Logout</a>');
		req.session.save();
	} else {
		res.write('<h1>Please login first.</h1>');
		res.end('<a href=' + '/' + '><< Back to Login</a>');
	}
});

app.get('/logout', function (req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.listen(3000, function () {
	console.log("Server running on port: 3000");
});