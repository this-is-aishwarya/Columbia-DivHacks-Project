
let express = require('express'),
    app = express(),
    passport = require('passport');
    session = require('express-session');
let GithubStrategy = require('passport-github').Strategy;

/***************************************************************
 *********** Github Configuration setup...
 ***************************************************************/
app.set('view engine', 'ejs')

passport.use(new GithubStrategy({
    clientID: "126ba0660944fb5b9a98",
    clientSecret: "531db8bad2329f4a4a95971b42eba7f40da801a4",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // we will just use the profile object returned by GitHub
    return done(null, accessToken, profile);
    console.log("Returning from GitHub!")
  }
));

// Express and Passport Session
app.use(session({
  secret: "jsonworldbestplaformforjsframeworks",
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    // placeholder for custom user serialization
    done(null,  
      {id: user.profile.id,
      accessToken: user.access_token
      }
      );
});

passport.deserializeUser(function(user, done) {
    // placeholder for custom user deserialization.
    // maybe you are going to get the user from mongo by id?
    
    done(null, user); // null is for errors
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
      res.redirect('/');
  });

app.get('/', function (req, res) {
    var html = "";

    // dump the user for debugging
    if (req.isAuthenticated()) {
      // html += "<ul>\
      //       <li><a href='/logout'>logout</a></li>\
      //     </ul>";
      // html += "<p>authenticated as user:</p>"
      // html += "<pre>" + JSON.stringify(req.user, null, 6) + "</pre>";
      // console.log(req.html);
      res.render('index')
    }
    else{
      html += "<ul>\
      <li><a href='/auth/github'>Login with GitHub</a></li>\
    </ul>";
    res.send(html)
    }   
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the login page.

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
    res.send("access granted");
});

app.listen(5000, function () {
    console.log('App listening at port: 5000');
});



