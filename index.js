var express = require('express'),
  pug = require('pug'),
  path = require('path'),
  route = require('./routes/routes.js'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session');


var app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');


app.use(cookieParser());
app.use(expressSession({secret:'uh potatoes', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname + '/public')));


var urlencodedParser = bodyParser.urlencoded({
  extended: true
});

app.get('/', route.index);
app.get('/details', route.details);
app.get('/create', route.create);
app.get('/edit/:id', route.edit);
app.get("/admin", route.admin)
app.post('/', urlencodedParser, route.signIn);
app.post('/create', urlencodedParser, route.createUser);
app.post('/edit/:id', urlencodedParser, route.editUser);
app.get('/delete/:id', route.delete);
 
app.listen(3000);
