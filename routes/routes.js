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
    var done = false;
    var boiledNum, bakedNum, MashedNum, FriedNum, sweetNum, russetNum, redNum, whiteNum, friesNum, totsNum, wedgeNum, hashNum;
    for(var j = 0; j < 12; j++)
        {
            if(j==0)
                {
                     boiledNum = countAnswerOne('Boiled');
                }
            else if(j == 1)
                {
                    bakedNum = countAnswerOne('Baked');
                }
            else if(j == 2)
                {
                    MashedNum = countAnswerOne('Mashed');
                }
            else if(j == 3)
                {
                   friedNum = countAnswerOne('Fried');
                }
            else if(j==4)
                {
                     sweetNum = countAnswerTwo("Sweet potatoes");
                }
            else if(j == 5)
                {
                    russetNum = countAnswerTwo("Russet potatoes");
                }
            else if(j == 6)
                {
                    redNum = countAnswerTwo("Red potatoes");
                }
            else if(j == 7)
                {
                   whiteNum = countAnswerTwo("White potatoes");
                }
            else if(j==8)
                {
                     friesNum = countAnswerThree("French Fries");
                }
            else if(j == 9)
                {
                    totsNum = countAnswerThree("Tatter tots");
                }
            else if(j == 10)
                {
                    wedgeNum = countAnswerThree("Potato Wedges");
                }
            else if(j == 11)
                {
                   hashNum = countAnswerThree("Hash Browns");
                    done = true;
                }
            
                }
    if(done == true)
                {
                    console.log("boiledNum: ", boiledNum);
                    console.log("bakedNum: ", bakedNum);
                    console.log("mashedNum: ", MashedNum);
                    console.log("FriedNum: ", FriedNum);
                    console.log("sweetNum: ", sweetNum);
                    console.log("russetNum: ", russetNum);
                    console.log("redNum: ", redNum);
                    console.log("whiteNum: ", whiteNum);
                    console.log("friesNum: ", friesNum);
                    console.log("totsNum: ", totsNum);
                    console.log("wedgeNum: ", wedgeNum);
                    console.log("hashNum: ", hashNum);
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
            boiledNum: boiledNum,
            bakedNum: bakedNum,
            MashedNum: MashedNum,
            FriedNum: FriedNum,
            sweetNum: sweetNum,
            russetNum: russetNum,
            redNum: redNum,
            whiteNum: whiteNum,
            friesNum: friesNum,
            totsNum: totsNum,
            wedgeNum: wedgeNum,
            hashNum: hashNum
        });
        
});
        }
   
    
    
    
    
    
    
    
    
    
}


function countAnswerOne(collection)
{
    var done = false;
     var tempUser = new User({
        userAnswer1: collection
    });
    var count = 0;
    User.find(function (err, user) {
    if (err) return console.error(err);
        for(var j = 0; j < user.length; j++)
            {
                if(j == 0)
                    {
                        console.log("word: ", tempUser.userAnswer1);
                    }
                var UA1 = user[j].userAnswer1;
                console.log("UA1: ",UA1);
                if(UA1 == tempUser.userAnswer1)
                    {
                        console.log("Match!");
                       count++; 
                        console.log("curCount: ", count);
                    }
                if(j == user.length - 1)
                    {
                        done = true;
                    }
                if(done == true)
                    {
                        console.log("return count for " + collection + ":", count);
                        return count;
                    }
            }
    });
}

function countAnswerTwo(collection)
{
    var done = false;
    var tempUser = new User({
        userAnswer2: collection
    });
    var count = 0;
    User.find(function (err, user) {
    if (err) return console.error(err);
        for(var j = 0; j < user.length; j++)
            {
                if(j == 0)
                    {
                        console.log("word: ", tempUser.userAnswer2);
                    }
                var UA2 = user[j].userAnswer2;
                console.log("UA2: ",UA2);
                if(UA2 == tempUser.userAnswer2)
                    {
                        console.log("Match!");
                       count++; 
                        console.log("curCount: ", count);
                    }
                if(j == user.length - 1)
                    {
                        done = true;
                    }
                if(done == true)
                    {
                        console.log("return count for " + collection + ":", count);
                        return count;
                    }
            }
    });
}

function countAnswerThree(collection)
{
    var done = false;
     var tempUser = new User({
        userAnswer3: collection
    });
    var count = 0;
    User.find(function (err, user) {
    if (err) return console.error(err);
        for(var j = 0; j < user.length; j++)
            {
                if(j == 0)
                    {
                        console.log("word: ", tempUser.userAnswer3);
                    }
                var UA3 = user[j].userAnswer3;
                console.log("UA3: ",UA3);
                if(UA3 == tempUser.userAnswer3)
                    {
                        console.log("Match!");
                       count++; 
                        console.log("curCount: ", count);
                    }
                if(j == user.length - 1)
                    {
                        done = true;
                    }
                if(done == true)
                    {
                        console.log("return count for " + collection + ":", count);
                        return count;
                    }
            }
    });
    
}