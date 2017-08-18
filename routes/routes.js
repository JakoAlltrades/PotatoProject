var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data', {
    useMongoClient: true
});

var bcrypt = require('bcrypt-nodejs');
var hash;

var curUser;

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function(callback){});

var userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    age: Number,
    isAdmin: Boolean,
    userAnswer1: String,
    userAnswer2: String,
    userAnswer3: String
});

function makeHash(the_str) {
    bcrypt.hash(the_str, null, null, function(err, hash){
        //how to compare back to the orignal unsalted string
    });
    return hash;  
}

function compareHash(the_str, passHash)
{
    bcrypt.compare(the_str, passash, function(err, res){
        console.log(res);
        return res;
        //how to compare back to the orignal unsalted string
    });  
}

var User = mongoose.model('User_Collection', userSchema);

exports.index = function (req,res){
    User.find(function(err, user){
        if(err) return console.error(err);
        res.render('index', {
            title: "Sign in"
        });
    });
};

exports.signInPost = function(req,res)
{
    var userName = req.body.userName;
    var password = req.body.password;
    User.findById(req.params.id, function(err, user){
        if(err) return console.error(err);
        if(user.userName.equals(userName))
            {
                if(compareHash(password, user.password))
                    {
                        res.render('details', {title: "Details"});
                    }
            }
    })
}

exports.create = function (req, res) {
  res.render('create', {
      title: 'Create User'
  });
};

exports.createUser = function (req, res) {
  var user = new User({
    userName: req.body.userName,
    password: makeHash(req.body.password),
    email: req.body.email,
    age: req.body.age,
    isAdmin: req.body.isAdmin,
    userAnswer1: req.body.userAnswer1, 
    userAnswer2: req.body.userAnswer2,
    userAnswer3: req.body.userAnswer3
  });
  user.save(function (err, user) {
    if (err) return console.error(err);
    console.log(user + ' added');
  });
  curUser = user;
  res.redirect('details');
};

exports.edit = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return console.error(err);
    res.render('edit', {
      title: 'Edit User',
      user: user
    });
  });
};

exports.editUser = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return console.error(err);
    user.userName = req.body.userName;
    user.password = makeHash(req.body.password);
    user.email = req.body.email;
    user.age = req.body.age;
    user.isAdmin = req.body.isAdmin;
    person.save(function (err, person) {
      if (err) return console.error(err);
      console.log(req.body.name + ' updated');
    });
  });
  curUser = user;
  res.redirect('/');

};

exports.details = function(req, res)
{
    User.find(function(err, user){
        user.userName = curUser.userName;
        user.password = curUser.password;
        user.email = curUser.email;
        user.age = curUser.age;
        user.isAdmin = curUser.isAdmin;
        user.userAnswer1 = curUser.userAnswer1;
        user.userAnswer2 = curUser.userAnswer2;
        user.userAnswer3 = curUser.userAnswer3;
        console.log("User: " + curUser);
        if(err) return console.error(err);
        res.render('details', {
            title:  "Details",
            user: user
        });
        
});
}
