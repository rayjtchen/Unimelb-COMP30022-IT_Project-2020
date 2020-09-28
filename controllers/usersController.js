const bcrypt  = require('bcryptjs');
const nodemailer = require("nodemailer");
const validator = require('validator');

// needed to generate and sign token 
const jwt = require('jsonwebtoken');

const User = require('mongoose').model('User');

// if auth is successful, create a token
const signToken = (user) => {
  const token = jwt.sign({
      userId: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      iat: Date.now()
    },  
    process.env.JWT_KEY, 
    {
      // IMPORTANT
      expiresIn: "1d"
    }
  );
  return token;
};

// Middleware to check the input body is ok
const checkBody = (req, res, next) => {
  
  // Check the required fields are not missing from input
  if(!req.body.username || !req.body.email || !req.body.password){
    return res.status(400).json({
        status: "Missing username, email, or password"
    });                  
  }

  // Check that the input email is indeed an email
  else if( !(validator.isEmail(req.body.email)) ){
    return res.status(400).json({
      status: "Invalid Email"
    });
  }

  next();
}

// Get all the users
const getAllUser = (req, res) => {
    try{
        User.find()
            .sort({date: -1})
            .then(users => res.json(users))
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err
        });
    }
};

/* Logins in user to website assuming that correct email and password is given */
const loginUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      // in the case that empty array is received (no user exists)
      if (!user) {
        return res.status(401).json({
          message: 'Email or Password is incorrect.'
        })
      }
      /* comparing passwords between database and given request 
       * response parameter is true or false depending if passwords matches */
      bcrypt.compare(req.body.password, user.password, (err, response) => {
        if (err) {
          return res.status(401).json({
            message: 'Email or Password is incorrect.'
          })
        }
        if (response) {
          // generation and signature of token - EXPIRES IN 1 HOUR 
          // FAIR WARNING - TOKEN IS ENCODED, NOT ENCRYPTED!!!!!!!
          const token = signToken(user);
          return res.status(200).json({
            message: 'Login successful',
            userAuthToken: {
              userID: user._id,
              token: "Bearer " + token,
              email: user.email,
              username: user.username
            }
          });
        }
        return res.status(401).json({
          message: 'Email or Password is incorrect.'
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    }); 
};

//register new user
const registerNewUser = function(req, res){
    
    //check the email
    const email = req.body.email;

    User.findOne({email: email})
        .then(foundObject => {
           if(foundObject){
               res.status(200).json({
                   status: 'Email is already registered',
               });
           }
           else{

               //create new user
               let newUser = new User({
                   email:req.body.email,
                   username:req.body.username,
                   password:req.body.password
               });

               //send confirmation email
               sendEmail(newUser.email, newUser._id);

               //hash the password
               bcrypt.genSalt(10, function(err, salt){
                   bcrypt.hash(newUser.password, salt, function(err, hash){
                       if(err){
                           console.log(err);
                       }
                       newUser.password = hash;
                       newUser.save()
                           .then(() => {
                               res.status(201).json({
                                   status: 'Thank you for registering - Please confirm your email address.',
                               });
                           });
                   });
               });
           }
        });
};

//send confirmation email
const sendEmail =  function(userEmail, userId) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'folio.exchange.team@gmail.com',
            pass: 'folioexchange'
        }
    });

    const mailOptions = {
        from: 'folio.exchange.team@gmail.com',
        to: userEmail,
        subject: 'Folio.Exchange - confirmation email',
        text: "Thank you for registering with folio.exchange, Here is your conformation link:" + "Localhost: http://localhost:5000/api/users/confirmation/" + userId + " Heroku: " + userId
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

//confirm the email address
const userEmailConfirmation = function(req, res){
    const userId = req.params.userId;

    if(userId.length != 24)
    {
        console.log('We could not find the verify link, please make sure it is correct');
        res.redirect('http://localhost:3000/');
        return;
    }

    User.findOne({_id: userId})
        .then(foundObject => {

            if(!foundObject){
                console.log('We could not find the verify link, please make sure it is correct');
                res.redirect('http://localhost:3000/');
            }
            else{
                foundObject.confirm = true;
                foundObject.save();
                console.log('Thank you, your email address has been verified. You can login now!');
                res.redirect('http://localhost:3000/');
            }
    });
};

// if facebook credentials are correct, return back a JWT
const facebookOAuth = (req, res) => {
  if (req.user.err) {
    res.status(401).json({
      message: "Authentication failed",
      error: req.user.err
    });
  } else {
    const token = signToken(req.user);
    res.status(200).json({
      message: 'Authentication Successful',
      // needed to find token (though there are other ways)
      token: "Bearer " + token
    });
  }
};

// THIS IS FOR TESTING PURPOSE (to test if token can be authorized)
const testUser = (req, res) => {
  res.status(200).json({
    success: true,
    msg: "Authorization successful"
  });
};

module.exports.registerNewUser = registerNewUser;
module.exports.loginUser = loginUser;
module.exports.getAllUser = getAllUser;
module.exports.userEmailConfirmation = userEmailConfirmation;
module.exports.facebookOAuth = facebookOAuth;
module.exports.testUser = testUser;
module.exports.checkBody = checkBody;
