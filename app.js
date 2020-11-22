var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('/Users/mac/Desktop/bookMark/models.js');
require('./models');
var bcrypt = require("bcryptjs");
var expressSession = require('express-session');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser')

var dotenv = require('dotenv');
dotenv.config();


var User = mongoose.model('User');
var Bookmarks = mongoose.model('Bookmarks');


mongoose.connect('mongodb://localhost:27017/datadb', { useNewUrlParser: true }, { useUnifiedTopology: true });



// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })



var app = express();

app.use('/pay-success', function(req, res, next){
  var data = "";
  req.on('data', function(chunk){ data += chunk})
  req.on('end', function(){
    req.rawBody = data;
    next();
  })
})

app.post("/pay-success", async (req, res) => {
  let eventType;
  // Check if webhook signing is configured.
  // const webhookSecret = "whsec_XPAT7YsJTO1AF9610OMze7jJAuakuMnW"
  const webhookSecret = process.env.ENDPOINT_WEBHOOK_KEY
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    var event;
    let signature = req.headers["stripe-signature"];
    // console.log(signature, req.rawBody)
    try {
      event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(err)
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;

  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
    console.log(event)
  }
  switch (eventType) {
    case 'checkout.session.completed':
      // console.log(event)
      // Payment is successful and the subscription is created.
      // You should provision the subscription.
        var session = event.data.object
        console.log(session)
        User.findOne({
          email: session.customer_email
        }, function(err, user){
          if (user){
            user.subscriptionActive = true;
            user.subscriptionId = session.subscription;
            user.customerId = session.customer;
            user.save();
            console.log('user subscription success')
          }
        });

        // console.log(u)

      // console.log('completed')
      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      console.log('invoidce paid')
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      console.log('invoidce paid failed')

      break;
    default:
      // Unhandled event type
  }

  res.sendStatus(200);
});



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: process.env.SESSION_KEY
}));
app.use(passport.initialize());
app.use(passport.session());

//Use passport to securely log in
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, next){
  User.findOne({
    email: email
  }, function(err, user){
    if (err) return next(err);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)){
      return next({message: "Email or password incorrect"})
    }
    next(null, user);
  })
}))

//Use passport to securely sign up
passport.use('signup-local',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, next){
  User.findOne({
    email: email
  }, function (err, user){
    if (err) return next(err);
    if (user) return next({message: "user already exists"})
  })
  let newUser = new User({
    email: email,
    passwordHash: bcrypt.hashSync(password, 10),
    // bookmarks: [{name: " ", url: " "}],
    folders: [{
      name: "Folder",
      bookmarks:[{name: "Simple Bookmarks", url: "markitsimpl.com"}]
    }],
    subscriptionActive: false

  })
  newUser.save(function (err){
    next(err, newUser);
  });
}))

passport.serializeUser(function(user, next){
  next(null, user._id)
})
passport.deserializeUser(function(id, next){
  User.findById(id, function(err, user){
    next(err, user);
  })
})

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
// const stripe = require('stripe')('sk_test_51HnQMLCQySIU6KiZE3lg1gvZlHGkV8Hz4Fa8HWmCFMU82XUrjeZKE2noUyQhwR8ugrK7prPT9yAoerNcWg1Ncurx007H4bRzaS');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



//Render index page
app.get('/', function (req, res, next){
  try {
    var currentUser = User.findById(req.user.id, function (err, res){
      console.log('no user logged in')
    })
  } catch(e){
    var currentUser = 'null'
  }

  res.render("index.ejs", {title: "BookMark Manager", currentUser: currentUser});
} )

app.get('/signup-page', function (req, res, next){

  try {
    var currentUser = User.findById(req.user.id, function (err, res){
      console.log('no user logged in')
    })
  } catch(e){
    var currentUser = 'null'
  }



  res.render("signup-page.ejs", {title: "BookMark Manager", currentUser:currentUser});
} )

app.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
})

app.get('/main', function (req, res, next){
  // console.log(req.body.name, 'dfdfd');

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })

  // var currentBookmarks = req.user.bookmarks

  // for (i = 0; i < currentBookmarks.length; i++) {
  //   // console.log(currentBookmarks[i].name)
  // }
  // console.log(document.getElementsByName('email'))


  var folder = req.user.folders[req.query.folder]
  var currentBookmarks = folder.bookmarks
  console.log(req.originalUrl, req.query, req.query.folder)

  // res.render('data.ejs',{data:mongoData})
  // <script> var data = '<%=data%>' </script>
  // res.render("index.ejs", {title: "BookMark Manager"});


  res.render("main.ejs", {bookmarkList: currentBookmarks, folders: req.user.folders, email: req.user.email});
} )

//save bookmarks to database
app.post('/save', jsonParser,function(req,res,next){

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })
  var folder = req.user.folders[req.query.folder]
  // var currentFolder = currentUser.findById(folder, function(err, res){
  //   // console.log(JSON.stringify(res))
  // })
  var folderId = req.query.folder
  var currentBookmarks = folder.bookmarks
  console.log(folderId);
  // var currentBookmarks = req.user.bookmarks
  currentBookmarks.push({name: req.body.email, url: req.body.password})
  // folders: [{
  //   name: "folder1",
  //   bookmarks:[{name: "book1", url: "url"}]
  // }]
  var bmFolder = 'folders.'+ folderId+'.bookmarks'

  console.log(currentBookmarks, bmFolder)
  // currentUser.update({
  //     bookmarks: currentBookmarks
  // }, function(err, res){
  //   if (err) return console.log(err);
  //
  // })
  currentUser.update({
    [bmFolder]: currentBookmarks
  }, function(err, res){
    if (err) return console.log(err);

  })



  // console.log(User, 'done', req.user.id);
  // res.end()
  res.redirect('/main?folder=' + folderId)

})

app.post('/delete', jsonParser, function (req, res, next) {
  console.log('delete')
  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })
  console.log(req.query.folder)
  var folder = req.user.folders[req.query.folder]

  var folderId = req.query.folder
  console.log(folder)
  var currentBookmarks = folder.bookmarks
  console.log(folderId);

  var bookmarkPos = req.body.password;

  currentBookmarks.splice(bookmarkPos, 1);

  var bmFolder = 'folders.'+ folderId+'.bookmarks'

  console.log(currentBookmarks, bmFolder)

  currentUser.update({
    [bmFolder]: currentBookmarks
  }, function(err, res){
    if (err) return console.log(err);

  })








  // console.log(req.body.email, req.body.password);
  // var bookmarkPos = req.body.password;
  // var currentBookmarks = req.user.bookmarks;
  // currentBookmarks.splice(bookmarkPos, 1);
  // console.log(currentBookmarks.length);
  // currentUser.update({
  //   bookmarks: currentBookmarks
  // }, function(err, res){
  //   if (err) return console.log(err);
  //
  // })

  res.redirect('/main?folder=' + folderId)
})
app.post('/edit', function (req, res, next) {
  console.log('edit')

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })
  console.log(req.query.folder)
  var folder = req.user.folders[req.query.folder]

  var folderId = req.query.folder
  console.log(folder)

  var value = req.body.inputId;
  var name = req.body.name;
  var link = req.body.link;
  var currentBookmarks = folder.bookmarks
  currentBookmarks[value].name = name;
  currentBookmarks[value].url = link
  console.log(folderId);

  var bmFolder = 'folders.'+ folderId+'.bookmarks'

  console.log(currentBookmarks, bmFolder)

  currentUser.update({
    [bmFolder]: currentBookmarks
  }, function(err, res){
    if (err) return console.log(err);

  })


  res.redirect('/main?folder=' + folderId)
  // res.redirect('/main')
  // currentUser.remove({bookmark: ''})
})

app.post('/saveMovement', function (req, res, next) {

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })
  // console.log(req.query.folder)
  var folder = req.user.folders[req.query.folder]

  var folderId = req.query.folder
  console.log(req.query.names)
  console.log(req.query.links)
  console.log(req.query.folder)
  // console.log(folder)
  console.log(req.body.nameInput1, 'input')
  console.log(req.body.linkInput1)

  // var names = req.body.nameInput1.split(',')
  // var links = req.body.linkInput1.split(',')
  var names = req.query.names.split(',')
  var links = req.query.links.split(',')


  var currentBookmarks = folder.bookmarks
  console.log(currentBookmarks)

  for (i=0; i<names.length; i++){
    currentBookmarks[i].name = names[i]
    currentBookmarks[i].url = links[i]
  }

  console.log(currentBookmarks)

  // console.log(folderId);

  var bmFolder = 'folders.'+ folderId+'.bookmarks'

  // console.log(currentBookmarks, bmFolder)

  currentUser.update({
    [bmFolder]: currentBookmarks
  }, function(err, res){
    if (err) return console.log(err);

  })


  res.redirect('/main?folder=' + folderId)


  // res.redirect('/main')
  // currentUser.remove({bookmark: ''})
})

//save bookmarks to database
app.post('/saveFolder', jsonParser,function(req,res,next){

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })
  // var folder = req.user.folders[req.query.folder]
  var folders = req.user.folders
  // var currentFolder = currentUser.findById(folder, function(err, res){
  //   // console.log(JSON.stringify(res))
  // })
  var folderId = req.query.folder
  // var currentBookmarks = folder.bookmarks
  console.log(folderId);
  // var currentBookmarks = req.user.bookmarks
  // currentBookmarks.push({name: req.body.email, url: req.body.password})
  folders.push({
      name: req.body.folderName,
      // bookmarks:[{name: "", url: ""}]
    })
  console.log(req.body.folderName)
  // folders: [{
  //   name: "folder1",
  //   bookmarks:[{name: "book1", url: "url"}]
  // }]
  // var bmFolder = 'folders.'+ folderId+'.bookmarks'
  //
  // console.log(currentBookmarks, bmFolder)
  // // currentUser.update({
  // //     bookmarks: currentBookmarks
  // // }, function(err, res){
  // //   if (err) return console.log(err);
  // //
  // // })
  currentUser.update({
    folders: folders
  }, function(err, res){
    if (err) return console.log(err);

  })



  // console.log(User, 'done', req.user.id);
  // res.end()
  res.redirect('/main?folder=' + folderId)

})

app.post('/editFolder', function (req, res, next) {
  console.log('edit')

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })

  console.log(req.query.folder, req.body.folderName)
  var folder = req.user.folders[req.query.folder]

  var folderId = req.query.folder
  console.log(folder)
  var newName = folder.name
  // folder.name = req.body.folderName

  // var currentBookmarks = folder.bookmarks
  // currentBookmarks[value].name = name;
  // currentBookmarks[value].url = link
  // console.log(folderId);

  var bmFolder = 'folders.'+ folderId+'.name'

  // console.log(currentBookmarks, bmFolder)

  currentUser.update({
    [bmFolder]: req.body.folderName
  }, function(err, res){
    if (err) return console.log(err);

  })


  res.redirect('/main?folder=' + folderId)
  // res.redirect('/main')
  // currentUser.remove({bookmark: ''})
})
app.post('/deleteFolder', function (req, res, next) {
  console.log('deleting folder')

  var currentUser = User.findById(req.user.id, function(err, res){
    // console.log(JSON.stringify(res))
  })

  // console.log(req.query.folder, req.body.folderName)
  var folder = req.user.folders[req.query.folder]
  var folders = req.user.folders
  var folderId = req.query.folder
  console.log(folder)
  folders.splice(folderId, 1)

  // folder.name = req.body.folderName

  // var currentBookmarks = folder.bookmarks
  // currentBookmarks[value].name = name;
  // currentBookmarks[value].url = link
  // console.log(folderId);

  var bmFolder = 'folders.'+ folderId+'.name'

  // console.log(currentBookmarks, bmFolder)

  currentUser.update({
    folders: folders
  }, function(err, res){
    if (err) return console.log(err);

  })


  res.redirect('/main?folder=0')
  // res.redirect('/main')
  // currentUser.remove({bookmark: ''})
})

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login-page' }),
    function(req, res) {
      if (req.user.subscriptionActive == true) {
        res.redirect('/main?folder=0');
      } else {
        res.redirect('/pricing');
      }




    });

app.get('/login-page', function(req, res, next) {

  try {
    var currentUser = User.findById(req.user.id, function (err, res){
      console.log('no user logged in')
    })
  } catch(e){
    var currentUser = 'null'
  }

  res.render('login-page', {currentUser:currentUser})
})
app.get('/create-customer-page', function(req, res, next) {
  res.render('create-customer-page')
})
app.get('/checkout-page', function(req, res, next) {
  res.render('checkout')
})

app.post('/create-customer', async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // save the customer.id as stripeCustomerId
  // in your database.

  res.send({ customer });
});

app.get('/pricing', function(req, res, next) {


  // try{
  //   // var currentUser = User.findById(req.user.id, function(err, res){
  //   //   // console.log(JSON.stringify(res))
  //   // })
  //   var currentUserId = req.user.id
  //   var subscriptionActive = req.user.subscriptionActive
  //   var email = req.user.email
  //
  // } catch (e){
  //   console.log('user not signed in')
  //   currentUser = 'null'
  //   var subscriptionActive = 'false'
  //   var email = 'null'
  //
  // }
  try {
    var currentUser = User.findById(req.user.id, function (err, res){
      console.log('no user logged in')
    })
  } catch(e){
    var currentUser = 'null'
  }



  if (currentUser != 'null'){
    var currentUserId = req.user.id
    var subscriptionActive = req.user.subscriptionActive
    var email = req.user.email
  } else {
    console.log('user not signed in')
    var currentUserId = 'null'
    var subscriptionActive = false
    var email = 'null@null.com'
  }



  // console.log(currentUser)

  const { priceId } = req.body;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = stripe.checkout.sessions.create({
      customer_email: email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICING,
          quantity: 1,
        },
      ],
      discounts: [{
        coupon: "fxeyWbcT"
      }],


      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: 'http://localhost:3000/main?folder=0',
      cancel_url: 'http://localhost:3000/pricing',
    }, function(err, session){
      if (err) return next(err);
      res.render('pricing',{sessionid: session.id, currentUser: currentUserId, subscriptionActive: subscriptionActive, STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY})
      // if (currentUser = 'null'){
      //   res.render('pricing',{sessionid: session.id, currentUser: currentUser, subscriptionActive: false})
      // } else {
      //   res.render('pricing',{sessionid: session.id, currentUser: currentUser, subscriptionActive: req.user.subscriptionActive})
      // }
    });

  //   res.send({
  //     sessionId: session.id,
  //   });
  // } catch (e) {
  //   res.status(400);
  //   return res.send({
  //     error: {
  //       message: e.message,
  //     }
  //   });
  // }
  // res.render('pricing')
} catch(e){
    if (e) return next(e);
  }
})


app.get('/cancel-page', function(req, res, next) {

  console.log(req.user.subscriptionId);

  res.render('cancel-page', {subscriptionId: req.user.subscriptionId})
})
app.get('/contactus-page', function(req, res, next) {
  try {
    var currentUser = User.findById(req.user.id, function (err, res){
      console.log('no user logged in')
    })
  } catch(e){
    var currentUser = 'null'
  }


  res.render('contactus-page', {currentUser: currentUser})
})

app.post('/cancel-subscription', async (req, res) => {
  // Delete the subscription
  const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
  );
  var currentUser = User.findById(req.user.id, function (err, res){

  })

  currentUser.update({
    subscriptionActive: false
  }, function(err, res){
    if (err) return console.log(err);

  })

  res.send(deletedSubscription);
});



//Post sign up data to database
app.post('/signup',
    passport.authenticate('signup-local', { failureRedirect: '/' }),
    function(req, res) {
      // var currentUser = User.findById(req.user.id, function(err, res){
      //   // console.log(JSON.stringify(res))
      // })
      // res.redirect('/main?folder=0');
      // console.log(currentUser.subscriptionActive, User.subscriptionActive, currentUser.folders)
      // if (currentUser.subscriptionActive != false){
      //   res.redirect('pricing')
      // }
      // else{
      //   res.redirect('/main?folder=0')
      // }
      // res.redirect('/create-customer-page')
      res.redirect('/pricing')

    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
