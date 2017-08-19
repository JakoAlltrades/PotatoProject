var express = require('express'),
  pug = require('pug'),
  path = require('path'),
  route = require('./routes/routes.js'),
  bodyParser = require('body-parser');


var app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));


var urlencodedParser = bodyParser.urlencoded({
  extended: true
})

app.get('/', route.index);
app.get('/details', route.details);
app.get('/create', route.create);
app.get('/edit/:id', route.edit);
app.post('/', urlencodedParser, route.signIn);
app.post('/create', urlencodedParser, route.createUser);
app.post('/edit/:id', urlencodedParser, route.editUser);
 
app.listen(3000);
