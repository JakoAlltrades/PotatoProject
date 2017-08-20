var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data', {
    useMongoClient: true
});

var bcrypt = require('bcrypt-nodejs');
//var hashed;

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

function makeHash(the_str,hashed) {
    bcrypt.hash(the_str, null, null, function(err, hash){
    //showHash(hash);
    hashed = hash
    console.log('log in the makehash', hashed);
    return hashed;
   
        //how to compare back to the orignal unsalted string
     });
}

function showHash(hash){
    hashed = hash;
    console.log("hash: " + hashed);
}

function compareHash(the_str, passHash)
{
    bcrypt.compare(the_str, passHash, function(err, res){
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

exports.admin = function(req,res)
{
    User.find(function (err, user) {
    if (err) return console.error(err);
    res.render('admin', {
      title: 'User List',
      users: user,
        user: curUser 
    });
  });
}

exports.signIn = function(req,res)
{
    var tempUser = new User({
        userName: req.body.userName,
        password: req.body.password
    })
    console.log("userName: ", tempUser.userName,", enteredPass: ", tempUser.password);
    User.findOne({userName: new RegExp('^'+tempUser.userName+'$', 'i') }, function(err, user){
        if(err) return console.error(err);
        console.log(user);
        console.log("password: ", user.password);
        if(user.userName === tempUser.userName)
            {
                //if(compareHash(tempUser.password, user.password))
                    //{
                        curUser = user;
                        if(user.isAdmin === false)
                        {
                            res.redirect('details');
                        }
                        else{
                            res.redirect("admin");
                        }
                    //}
            }
    });
};

exports.create = function (req, res) {
  res.render('create', {
      title: 'Create User'
  });
};

exports.createUser = function (req, res) {
    //console.log("hashed: ", hashed);
    var hashPass = "";
   var sauce =  makeHash(req.body.password, hashPass);
    console.log("sauce:",sauce);
    //console.log("hashed hash: ", hashed);
   // console.log("create check:",req.body.password);
    var user = new User({
    userName: req.body.userName,
    password: sauce,
    email: req.body.email,
    age: req.body.age,
    isAdmin: false,
    userAnswer1: req.body.userAnswer1, 
    userAnswer2: req.body.userAnswer2,
    userAnswer3: req.body.userAnswer3
  });
    //console.log("Password pre hash:",user.password);
    //user.password = makeHash(user.password);
    //console.log("Password Post hash:",user.password);
  user.save(function (err, user) {
    if (err) return console.error(err);
      console.log("User: " + user);
    console.log(user + ' added');
  });
  curUser = user;
    if(user.isAdmin === false)
        {
             res.redirect('details');
        }
    else{
        res.redirect("admin");
    }
 
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

exports.delete = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return console.error(err);
    res.redirect('/');
  });
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
        
        if(err) return console.error(err);
        res.render('details', {
            title:  "Details",
            user: user,
            boiledNum: countAnswerOne('Boiled'),
            bakedNum: countAnswerOne('Baked'),
            MashedNum: countAnswerOne('Mashed'),
            friedNum: countAnswerOne('Fried'),
            sweetNum: countAnswerTwo("Sweet potatoes"),
            russetNum: countAnswerTwo("Russet potatoes"),
            redNum: countAnswerTwo("Red potatoes"),
            whiteNum: countAnswerTwo("White potatoes"),
            friesNum: countAnswerThree("French Fries"),
            totsNum: countAnswerThree("Tatter tots"),
            wedgeNum: countAnswerThree("Potato Wedges"),
            hashNum: countAnswerThree("Hash Browns")
        });
        
});
}


function countAnswerOne(collection)
{
    var count = 0;
    console.log("word: ", collection );
    User.find(function (err, user) {
    if (err) return console.error(err);
        for(var j = 0; j < user.length; j++)
            {
                console.log("Answer1: ",user[j].userAnswer1);
                if(user[j].userAnswer1.prototype.toLowerCase == collection.toLowerCase)
                    {
                       count++; 
                    }
            }
    });
    return count;
}

function countAnswerTwo(collection)
{
    var count = 0;
    console.log("word: ", collection );
    User.find(function (err, user) {
    if (err) return console.error(err);
        for(var j = 0; j < user.length; j++)
            {
                console.log("Answer2: ",user[j].userAnswer2);
                if(user[j].userAnswer2.prototype.toLowerCase == collection.toLowerCase)
                    {
                       count++; 
                    }
            }
    });
    return count;
}

function countAnswerThree(collection)
{
    var count = 0;
    console.log("word: ", collection );
    User.find(function (err, user) {
    if (err) return console.error(err);
        console.log("user length", user.length);
        for(var j = 0; j < user.length; j++)
            {
                console.log("Answer3: ",user[j].userAnswer3);
                if(user[j].userAnswer3.prototype.toLowerCase == collection.toLowerCase)
                    {
                       count++; 
                    }
            }
    });
    return count;
}